# 🎮 Personalized Game Recommendation System on AWS

A full-stack web application that provides personalized game recommendations based on user interests. The backend is powered by a custom Machine Learning model and Flask APIs, while the frontend is built using HTML, CSS, and JavaScript. The project is deployed on AWS for scalability and accessibility.

---

## 📌 Features

- 🔍 Recommends games using machine learning based on user preferences
- ⚙️ Backend REST APIs built with Flask
- 📊 Game metadata processing using Pandas
- 🌐 Deployed on AWS EC2 for public accessibility
- 🧠 ML Model using cosine similarity and user profiling
- 💡 Clean and interactive UI for seamless experience

---

## 🛠️ Tech Stack

| Layer        | Tools/Frameworks                                |
|-------------|--------------------------------------------------|
| Frontend    | HTML, CSS, JavaScript                            |
| Backend     | Python, Flask, Pandas                            |
| Machine Learning | Cosine Similarity, User-based Filtering     |
| Deployment  | AWS EC2, Git, Virtualenv                         |

---

## 📁 Folder Structure

```

AWS-Project-01/
│
├── static/                 # Static assets (CSS, JS)
├── templates/              # HTML Templates
├── game\_data.csv           # Game metadata used for recommendations
├── app.py                  # Main Flask application
├── model.py                # Recommendation logic
└── requirements.txt        # Python dependencies

````

---

## 🚀 Getting Started

### Prerequisites

- Python 3.7+
- Git
- AWS EC2 instance (or local machine)
- Virtualenv (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Anurag-015/AWS-Project-01.git
cd AWS-Project-01

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
````

---

## 🌍 Deployment on AWS

1. Launch an EC2 instance (Ubuntu)
2. SSH into the instance and clone this repo
3. Install Python, pip, virtualenv
4. Run the app as shown above
5. Use `tmux` or `screen` to keep it running in background
6. Update security group to allow access on port 5000
7. Visit: `http://<your-ec2-public-ip>:5000`

---

## 📷 Screenshots

*(Optional: Add images of UI or API responses)*

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👤 Author

**Anurag Gupta**
📧 [mr.anuraggupta2003@gmail.com](mailto:mr.anuraggupta2003@gmail.com)
🌐 [GitHub](https://github.com/Anurag-015)

