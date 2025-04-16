# MCAT Progress Tracker Full Stack

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Overview

- **Frontend**: Hosted on [Vercel](https://vercel.com) at [https://mcat-progress-tracker-full-stack.vercel.app/](https://mcat-progress-tracker-full-stack.vercel.app/).
- **Backend**: Hosted on an EC2 Ubuntu instance called **mcat-deploy**, with the Public IPv4 address: `52.55.154.139`.
- **HTTPS Backend**: Handled by [ngrok](https://ngrok.com), connected to your GitHub account. The backend is accessible at [https://7f3f-52-55-154-139.ngrok-free.app](https://7f3f-52-55-154-139.ngrok-free.app), mapping to `localhost:5000`.
- **Backend in a tmux session**: Flask and ngrok run in a tmux session, which you can reenter with the command:
  ```bash
  tmux a
```
## Running the Backend

To run Flask, navigate to the `/src` directory and run:

```bash
python3 app.py
```

Ensure that the app configuration has host="0.0.0.0" and the correct port. If ngrok is killed, simply restart it by running:
```bash
ngrok 5000
```