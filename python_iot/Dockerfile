FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies from requirements.txt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your application code (assuming main.py and other modules are here)
COPY . .

# Default command (update this if your script filename is different)
CMD ["python", "switch.py"]
