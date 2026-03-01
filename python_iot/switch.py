import os
import asyncio
import newrelic.agent
newrelic.agent.initialize('newrelic.ini') #This is required!
import requests
import json
import logging
from dotenv import load_dotenv
from sinricpro import SinricPro, SinricProSwitch, SinricProConfig

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

APP_KEY = os.environ.get('APP_KEY')
APP_SECRET = os.environ.get('APP_SECRET')
SWITCH_ID = os.environ.get('SWITCH_ID')
URL = os.environ.get('URL')

motorStateLocal = 0 

@newrelic.agent.background_task(name='sinric-OperateMotor', group='Task')
def operate_motor(operation_bool):
    """
    Translates boolean state to string for your SpringBoot API.
    """
    operation_str = "On" if operation_bool else "Off"
    headers = {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Host': 'python-sinric-device',
    }
    data = {'secret': APP_KEY, 'operation': operation_str}
    
    try:
        response = requests.post(f"{URL}/operate-motor", headers=headers, data=json.dumps(data))
        if response.status_code == 200:
            logger.info(f"Motor Operation {operation_str} successful!")
            return operation_bool
        else:
            logger.error(f"API Error: {response.status_code}")
            return not operation_bool
    except Exception as e:
        logger.error(f"Motor request failed: {e}")
        return not operation_bool

@newrelic.agent.background_task(name='sinric-turn-on', group='Task')
async def on_power_state(state: bool) -> bool:
    """
    Callback triggered by SinricPro Cloud (Alexa/Google Home/App).
    """
    global motorStateLocal
    logger.info(f"Cloud request: Turn motor {'ON' if state else 'OFF'}")
    
    # Execute the motor operation
    success_state = operate_motor(state)
    motorStateLocal = 1 if success_state else 0
    
    return True # Return True to acknowledge the command was received

@newrelic.agent.background_task(name='sinric-check-spring-boot', group='Task')
async def check_device_status_periodically(my_switch, interval=10):
    """
    Polls your SpringBoot server and pushes updates to SinricPro if changed.
    """
    global motorStateLocal
    headers = {'Accept': '*/*', 'Content-Type': 'application/json', 'Host': 'python-sinric-device'}
    data = {'secret': APP_KEY}
    
    while True:
        try:
            response = requests.post(f"{URL}/motor-status", headers=headers, data=json.dumps(data))
            if response.status_code == 200:
                status_data = response.json()
                payload = status_data.get('payload', {})
                motorStatus = payload.get('status', 0) 
                
                if motorStateLocal != motorStatus:
                    logger.info(f"Syncing local state {motorStatus} to SinricPro")
                    # Push event to cloud: True for 1, False for 0
                    await my_switch.send_power_state_event(bool(motorStatus))
                    motorStateLocal = motorStatus
        except Exception as e:
            logger.error(f"Status check failed: {e}")
            
        await asyncio.sleep(interval)

@newrelic.agent.background_task(name='sinric-heartbeat', group='Task')
async def send_power_state_heartbeat(my_switch, interval=30):
    """
    Forces a state update to SinricPro periodically.
    """
    while True:
        await asyncio.sleep(interval)
        state_to_send = bool(motorStateLocal)
        logger.info(f"Heartbeat: Sending state {state_to_send} to cloud")
        await my_switch.send_power_state_event(state_to_send)

async def main():
    # 1. Initialize SinricPro Instance
    sinric_pro = SinricPro.get_instance()

    # 2. Create the Switch Device
    my_switch = SinricProSwitch(SWITCH_ID)

    # 3. Register the Callback
    my_switch.on_power_state(on_power_state)

    # 4. Add device to the controller
    sinric_pro.add(my_switch)

    # 5. Setup Config
    config = SinricProConfig(app_key=APP_KEY, app_secret=APP_SECRET)

    try:
        logger.info("Connecting to SinricPro...")
        # Start the background tasks along with the connection
        await asyncio.gather(
            sinric_pro.begin(config),
            check_device_status_periodically(my_switch),
            send_power_state_heartbeat(my_switch)
        )
    except KeyboardInterrupt:
        logger.info("Shutting down...")
    finally:
        await sinric_pro.stop()

if __name__ == "__main__":
    asyncio.run(main())