FROM python:3.13-alpine

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the application code and the entry point
COPY ./app /code/app
COPY ./run.py /code/run.py

CMD ["python", "run.py"]