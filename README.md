# Find Remote Work Employees
## Tech Stack 🗃

<img src="https://img.shields.io/badge/-ExpressJS-grey?style=flat&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/-NodeJS%20-%2320232a?style=flat&logo=node.js"> <img src="https://img.shields.io/badge/WhatsApp-25D366?style=flat&logo=whatsapp&logoColor=white"> <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=flat&logo=twitter&logoColor=white">
 
##  Getting Started 👨‍💻

### 👀 How to use Find Remote Work Employees?
Connect to the whatsapp sandbox by sending a WhatsApp message from your device to +1 415 523 8886 with code join write-bright. Then type the twitter handle of the company of which you want to get the twitter handles of the employees working there.

#### A video illustration

https://user-images.githubusercontent.com/69013647/147380310-0f6011e1-e366-4e12-90f7-ccafff3bcc30.mp4

### 🧑🏻‍💻 Local Development

1. `Fork` the repository  - Creates a replica of repository to your local environment.
2. Clone the repository - Downloads all repo files to your machine, using
  ```git
  git clone https://github.com/YOUR_USERNAME/find-company-employees.git
  ``` 
3. Set working directory to the root directory of the project.
  ```sh
  cd find-company-employees
  ```
4. Install all the required packages and dependencies.
  ```node
  npm install
  ```
5. Run the server.
  ```node
  npm run start
  ```
6. Create a .env file and put the twitter and twilio authentication secrets there.
7. Open another terminal and host localhost:3000 in ngrok
  ```ngrok
  ngrok http 3000
  ```
8. Configure twilio whatsapp sandbox settings with the url generated using ngrok(POST Request)
  ```
  YOUR NGROK URL/receive
  ```
###  You are all ready now to get the twitter handles of the employees working in a specified company. Type in the company name in the twilio whatsapp number's chatbox and you will get a list of the twitter handles of the employees asscociated with that company. 

#### NOTE: Due to twitter rate limits barrier there might be some problems which I am still working on.