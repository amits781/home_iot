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

def operate_motor(operation):
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
            logger.error(f"Error in request: {response.status_code} - {response.text}")
            operation = "On" if operation == "Off" else "Off"
            return operation
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {e}")
        operation = "On" if operation == "Off" else "Off"
        return operation

def power_state(device_id, state):
    global motorStateLocal
    logger.info('device_id: {} state: {}'.format(device_id, state))
    state = operate_motor(state)
    motorStateLocal = 0 if state == "Off" else 1
    return True, state

async def check_device_status_periodically(interval=30):
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
        logger.info("Checking device status...")
        try:
            # The API request to check device status.
            response = requests.post(f"{URL}/motor-status", headers=headers, data=json.dumps(data))
            if response.status_code == 200:
                # The response contains a JSON with {"status": 1} or {"status": 0}
                status_data = response.json()
                payload = status_data.get('payload', {})
                motorStatus = payload.get('status', 0)  # Default to '0' if status is not present.
                logger.info(f"Current motor status: {motorStatus}")
                logger.info(f"Last motor status: {motorStateLocal}")
                if motorStateLocal != motorStatus:
                    # Update the SinricPro about the current status.
                    iotDeviceStatus = SinricProConstants.POWER_STATE_OFF if motorStatus == 0 else SinricProConstants.POWER_STATE_ON
                    client.event_handler.raise_event(SWITCH_ID, SinricProConstants.SET_POWER_STATE, data = {SinricProConstants.STATE: iotDeviceStatus })
            else:
                logger.error(f"Failed to check motor status. HTTP Error: {response.status_code}")
                client.event_handler.raise_event(SWITCH_ID, SinricProConstants.SET_POWER_STATE, data = {SinricProConstants.STATE: SinricProConstants.POWER_STATE_OFF })

        except Exception as e:
            logger.error(f"An error occurred while checking motor status: {e}")
            client.event_handler.raise_event(SWITCH_ID, SinricProConstants.SET_POWER_STATE, data = {SinricProConstants.STATE: SinricProConstants.POWER_STATE_OFF })
        await asyncio.sleep(interval)  # Wait for the specified interval before the next check.

callbacks = {
    SinricProConstants.SET_POWER_STATE: power_state
}

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    client = SinricPro(APP_KEY, [SWITCH_ID], callbacks,
                       enable_log=False, restore_states=False, secret_key=APP_SECRET)
    asyncio.ensure_future(check_device_status_periodically())
    loop.run_until_complete(client.connect())

# To update the power state on server.
# client.event_handler.raise_event(SWITCH_ID, SinricProConstants.SET_POWER_STATE, data = {SinricProConstants.STATE: SinricProConstants.POWER_STATE_ON })
# client.event_handler.raise_event(SWITCH_ID, SinricProConstants.SET_POWER_STATE, data = {SinricProConstants.STATE: SinricProConstants.POWER_STATE_OFF })
