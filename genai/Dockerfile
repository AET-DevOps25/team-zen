FROM python:3.13-alpine

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy only the application code, excluding tests and development files
COPY ./app /code/app

CMD ["fastapi", "run", "app/main.py", "--port", "8082"]