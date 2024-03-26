import newrelic.agent
newrelic.agent.initialize('newrelic.ini') #This is required!
import os
from dotenv import load_dotenv
from sinric import SinricPro, SinricProConstants
import asyncio
import requests
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Load environment variables from .env file
load_dotenv()

APP_KEY = os.environ.get('APP_KEY')
APP_SECRET = os.environ.get('APP_SECRET')
SWITCH_ID = os.environ.get('SWITCH_ID')
URL = os.environ.get('URL')

motorStateLocal = 0 # Global reference to motor status

@newrelic.agent.background_task(name='motor-operate', group='Task')
def operate_motor(operation):
    """
    Make an API call to SpringBoot with desired operation.
    """
    headers = {
        'Accept': '*/*',
        'Content-Type': 'application/json',
    }
    data = {
        'secret': APP_KEY,
        'operation': operation
    }
    try:
        response = requests.post(f"{URL}/operate-motor", headers=headers, data=json.dumps(data))
        if response.status_code == 200:
            logger.info(f"Motor Operation {operation} successful!")
            return operation
        else:
            logger.error(f"Error in performing motor operation: HTTP Error: {response.status_code} - {response.text}")
            operation = "On" if operation == "Off" else "Off"
            return operation
    except requests.exceptions.RequestException as e:
        logger.error(f"Exception in performing motor operation: {e}")
        operation = "On" if operation == "Off" else "Off"
        return operation

@newrelic.agent.background_task(name='motor-power-state-update', group='Task')
def power_state(device_id, state):
    global motorStateLocal
    logger.info('Updating | device_id: {} state: {}'.format(device_id, state))
    state = operate_motor(state)
    motorStateLocal = 0 if state == "Off" else 1
    return True, state

async def check_device_status_periodically(interval=10):
    """
    Periodically checks the device status by making an API call and updates it accordingly.
    """
    global motorStateLocal
    headers = {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            }
    data = {
        'secret': APP_KEY
    }
    while True:
        try:
            # The API request to check device status.
            response = requests.post(f"{URL}/motor-status", headers=headers, data=json.dumps(data))
            if response.status_code == 200:
                # The response contains a JSON with {"status": 1} or {"status": 0}
                status_data = response.json()
                payload = status_data.get('payload', {})
                motorStatus = payload.get('status', 0)  # Default to '0' if status is not present.
                # logger.info(f"Current motor status: {motorStatus}")
                # logger.info(f"Last motor status: {motorStateLocal}")
                newrelic.agent.record_log_event(message=f"Current motor status: {motorStatus}", level=logging.INFO)
                newrelic.agent.record_log_event(message=f"Last motor status: {motorStateLocal}", level=logging.INFO)
                if motorStateLocal != motorStatus:
                    # Update the SinricPro about the current status.
                    iotDeviceStatus = SinricProConstants.POWER_STATE_OFF if motorStatus == 0 else SinricProConstants.POWER_STATE_ON
                    client.event_handler.raise_event(SWITCH_ID, SinricProConstants.SET_POWER_STATE, data = {SinricProConstants.STATE: iotDeviceStatus })
                    newrelic.agent.record_log_event(message=f"Updating motor status to: {motorStatus}", level=logging.INFO)
                    motorStateLocal = motorStatus
            else:
                # logger.error(f"Error in checking motor status. HTTP Error: {response.status_code} - {response.text}")
                # logger.warn(f"Setting motor power state to Off")
                newrelic.agent.record_log_event(message=f"Error in checking motor status. HTTP Error: {response.status_code} - {response.text}", level=logging.ERROR)
                newrelic.agent.record_log_event(message=f"Setting motor power state to Off", level=logging.WARN)
                client.event_handler.raise_event(SWITCH_ID, SinricProConstants.SET_POWER_STATE, data = {SinricProConstants.STATE: SinricProConstants.POWER_STATE_OFF })

        except Exception as e:
            # logger.error(f"Exception occurred while checking motor status: {e}")
            # logger.warn(f"Setting motor power state to Off")
            newrelic.agent.record_log_event(message=f"Exception occurred while checking motor status: {e}", level=logging.ERROR)
            newrelic.agent.record_log_event(message=f"Setting motor power state to Off", level=logging.WARN)
            client.event_handler.raise_event(SWITCH_ID, SinricProConstants.SET_POWER_STATE, data = {SinricProConstants.STATE: SinricProConstants.POWER_STATE_OFF })
        await asyncio.sleep(interval)  # Wait for the specified interval before the next check.

callbacks = {
    SinricProConstants.SET_POWER_STATE: power_state
}

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    client = SinricPro(APP_KEY, [SWITCH_ID], callbacks,
                       enable_log=False, restore_states=False, secret_key=APP_SECRET)
    coroutines = asyncio.gather(check_device_status_periodically(), client.connect())
    loop.run_until_complete(coroutines)

# To update the power state on server.
# client.event_handler.raise_event(SWITCH_ID, SinricProConstants.SET_POWER_STATE, data = {SinricProConstants.STATE: SinricProConstants.POWER_STATE_ON })
# client.event_handler.raise_event(SWITCH_ID, SinricProConstants.SET_POWER_STATE, data = {SinricProConstants.STATE: SinricProConstants.POWER_STATE_OFF })
