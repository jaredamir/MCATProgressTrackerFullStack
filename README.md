# MCAT Progress Tracker Full Stack

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Project Overview

- **Frontend**: Hosted on [Vercel](https://vercel.com) at [https://mcat-progress-tracker-full-stack.vercel.app/](https://mcat-progress-tracker-full-stack.vercel.app/).
- **Backend**: Hosted on an EC2 Ubuntu instance called **mcat-deploy**, with the Public IPv4 address: `52.55.154.139`.
- **HTTPS Backend**: Handled by [ngrok](https://ngrok.com), connected to your GitHub account. The backend is accessible at [https://7f3f-52-55-154-139.ngrok-free.app](https://7f3f-52-55-154-139.ngrok-free.app), mapping to `localhost:5000`.
- **Backend in a tmux session**: Flask and ngrok run in a tmux session
 ## tmux Basics

### Start a new tmux session
To start a new tmux session, run:

    tmux new-session -s mysession

This will create a new session named `mysession`. You can replace `mysession` with any name you prefer.

---

### Split the tmux window into two panels

**Horizontal split:**

- Press `Ctrl + b`, then release both keys and press `%`.

**Vertical split:**

- Press `Ctrl + b`, then release both keys and press `"`.

---

### Switch between panels

- Press `Ctrl + b`, then use the arrow keys (← ↑ ↓ →) to switch between panels.

---

### Detach from the tmux session

- Press `Ctrl + b`, then release both keys and press `d`.

This will detach you from the session and leave it running in the background.

---

### Reattach to an existing tmux session

To reattach to a session:

    tmux attach-session -t mysession

If you're not sure of the session name, list all active sessions with:

    tmux ls

Then pick the one you want to reattach to.

## Running the Backend

To run Flask, navigate to the `/src` directory and run:

```bash
python3 app.py
```

Ensure that the app configuration has host="0.0.0.0" and the correct port. If ngrok is killed, simply restart it by running:
```bash
ngrok 5000
```

Run these in the two tmux panels within the session