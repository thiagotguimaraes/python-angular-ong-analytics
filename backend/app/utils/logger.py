import logging

# Configure a reusable logger for the application
logging.basicConfig(
    level=logging.INFO,  # Set the logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",  # Define the log format
)

logger = logging.getLogger("app")  # Create a logger instance for the application