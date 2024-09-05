#!/bin/bash
gunicorn -k quart.worker.GunicornWorker app:app
