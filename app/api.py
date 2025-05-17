from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import pandas as pd
import random
import os
print(os.listdir())
app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')
# Load your game data
file_path = './app/info.csv'
games_data = pd.read_csv(file_path)

@app.route('/get_random_games', methods=['GET'])
def get_random_games():
    n = request.args.get('n', default=10, type=int)
    random_games = games_data.sample(n=n, random_state=random.randint(1, 474420))
    random_games_cleaned = random_games[['name', 'platforms', 'genres', 'publishers']].where(pd.notnull(random_games), None)
    return jsonify(random_games_cleaned.to_dict(orient='records'))

@app.route('/recommend_games', methods=['POST'])
def recommend_games_endpoint():
    selected_games = request.json.get('selected_games')
    previous_recommendations = request.json.get('previous_recommendations', [])
    disliked_games = request.json.get('disliked_games', [])
    
    selected_games_df = pd.DataFrame(selected_games)
    recommended_games = recommend_games(selected_games_df, games_data, previous_recommendations, disliked_games)
    recommended_games_cleaned = recommended_games.where(pd.notnull(recommended_games), None)
    return jsonify(recommended_games_cleaned.to_dict(orient='records'))

def recommend_games(selected_games, games_data, previous_recommendations, disliked_games, top_n=3):
    similar_games = pd.DataFrame()
    
    for _, game in selected_games.iterrows():
        platform = str(game['platforms'])
        genre = str(game['genres'])
        publisher = str(game['publishers'])
        
        matching_games = games_data[
            (games_data['platforms'].str.contains(platform, na=False)) |
            (games_data['genres'].str.contains(genre, na=False)) |
            (games_data['publishers'].str.contains(publisher, na=False))
        ]
        similar_games = pd.concat([similar_games, matching_games])
    
    similar_games = similar_games.drop_duplicates(subset='name').reset_index(drop=True)
    similar_games = similar_games[~similar_games['name'].isin(selected_games['name'])]
    similar_games = similar_games[~similar_games['name'].isin(previous_recommendations)]
    similar_games = similar_games[~similar_games['name'].isin(disliked_games)]
    
    return similar_games[['name', 'platforms', 'genres', 'publishers']].head(top_n)

if __name__ == '__main__':
    app.run(debug=True)
    