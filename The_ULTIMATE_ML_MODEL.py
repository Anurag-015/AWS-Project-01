import pandas as pd
import random

file_path = 'game_info.csv'
games_data = pd.read_csv(file_path)

def get_random_games(games_data, n=10):
    random_games = games_data.sample(n=n, random_state=random.randint(1, 474420))
    return random_games[['name', 'platforms', 'genres', 'publishers']]

def display_games_with_indices(games_df):
    print("Select 4 games from the list below (by index):")
    for idx, game in games_df.iterrows():
        print(f"{idx}: {game['name']} — Platforms: {game['platforms']}, Genres: {game['genres']}, Publishers: {game['publishers']}")

def recommend_games(selected_games, games_data, previous_recommendations, disliked_games, top_n=1):
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

def select_disliked_games(games_data, selected_games, diversity_factor=0.5):
    disliked_games = pd.DataFrame()
    for _, game in selected_games.iterrows():
        platform = str(game['platforms'])
        genre = str(game['genres'])
        publisher = str(game['publishers'])
        non_matching_games = games_data[
            ~(games_data['platforms'].str.contains(platform, na=False)) &
            ~(games_data['genres'].str.contains(genre, na=False)) &
            ~(games_data['publishers'].str.contains(publisher, na=False))
        ]
        diversity_scores = non_matching_games.apply(lambda row: 1 - (row['platforms'] == platform) - (row['genres'] == genre) - (row['publishers'] == publisher), axis=1)
        non_matching_games['diversity_score'] = diversity_scores
        non_matching_games = non_matching_games.sort_values(by='diversity_score', ascending=False)
        disliked_games = pd.concat([disliked_games, non_matching_games.head(int(len(non_matching_games) * diversity_factor))])
    disliked_games = disliked_games.drop_duplicates(subset='name').reset_index(drop=True)
    return disliked_games['name'].tolist()

def run_game_recommendation_system(games_data):
    random_games = get_random_games(games_data)
    display_games_with_indices(random_games)
    while True:
        try:
            selected_indices = input("Select 4 games by entering their indices space separated, e.g., 1 3 5 7: ")
            selected_indices = [int(x) for x in selected_indices.split(' ')]
            if len(selected_indices) != 4:
                raise ValueError("Please select exactly 4 games.")
            selected_games = random_games.iloc[selected_indices]
            break
        except (ValueError, IndexError):
            print("Invalid input. Please enter 4 unique indices separated by spaces.")
    previous_recommendations = []
    disliked_games = []
    while True:
        new_disliked_games = select_disliked_games(games_data, selected_games)
        disliked_games.extend(new_disliked_games)
        disliked_games = list(set(disliked_games))
        recommended_games = recommend_games(selected_games, games_data, previous_recommendations, disliked_games)
        if recommended_games.empty:
            print("No more recommendations available based on your selections.")
            break
        print("\nRecommended game(s):")
        print(recommended_games)
        feedback = input("Do you like the recommendation? (yes/no) or type 'exit' to stop: ").lower()
        if feedback == 'exit':
            print("Exiting the recommendation system.")
            break
        elif feedback == 'yes':
            previous_recommendations.extend(recommended_games['name'].tolist())
        elif feedback == 'no':
            disliked_games.extend(recommended_games['name'].tolist())
            disliked_games = list(set(disliked_games))
        else:
            print("Invalid input, please enter 'yes', 'no', or 'exit'.")
run_game_recommendation_system(games_data)
