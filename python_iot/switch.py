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
        response = requests.post(URL, headers=headers, data=json.dumps(data))
        if response.status_code == 200:
            logger.info(f"Motor Operation {operation} successful!")
        else:
            logger.error(f"Error in request: {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {e}")

def power_state(device_id, state):
    print('device_id: {} state: {}'.format(device_id, state))
    operate_motor(state)
    return True, state


callbacks = {
    SinricProConstants.SET_POWER_STATE: power_state
}

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    client = SinricPro(APP_KEY, [SWITCH_ID], callbacks,
                       enable_log=False, restore_states=False, secret_key=APP_SECRET)
    loop.run_until_complete(client.connect())

# To update the power state on server.
# client.event_handler.raise_event(SWITCH_ID, SinricProConstants.SET_POWER_STATE, data = {SinricProConstants.STATE: SinricProConstants.POWER_STATE_ON })
# client.event_handler.raise_event(SWITCH_ID, SinricProConstants.SET_POWER_STATE, data = {SinricProConstants.STATE: SinricProConstants.POWER_STATE_OFF })
