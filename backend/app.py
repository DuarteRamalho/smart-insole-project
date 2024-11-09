from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)

def generate_insole_data(days=1):
    data = []
    start_date = datetime.now() - timedelta(days=days)
    
    for day in range(days):
        current_date = start_date + timedelta(days=day)
        daily_steps = 0
        
        for hour in range(24):
            timestamp = current_date + timedelta(hours=hour)
            steps = random.randint(0, 500)
            daily_steps += steps
            
            # Generate pressure data for both feet
            left_foot = {
                'inner': random.randint(60, 100),
                'outer': random.randint(0, 40)
            }
            right_foot = {
                'inner': random.randint(60, 100),
                'outer': random.randint(0, 40)
            }
            
            # Calculate pressure distribution
            left_total = left_foot['inner'] + left_foot['outer']
            right_total = right_foot['inner'] + right_foot['outer']
            
            entry = {
                'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'heart_rate': random.randint(60, 100),
                'steps': steps,
                'temperature': round(random.uniform(36.0, 37.5), 1),
                'pressure': random.randint(800, 1000),  # Keeping existing pressure
                'calories': random.randint(0, 100),
                'foot_pressure': {
                    'left_foot': {
                        'inner_pressure': left_foot['inner'],
                        'outer_pressure': left_foot['outer'],
                        'balance_percentage': round((left_foot['inner'] / left_total) * 100, 1)
                    },
                    'right_foot': {
                        'inner_pressure': right_foot['inner'],
                        'outer_pressure': right_foot['outer'],
                        'balance_percentage': round((right_foot['inner'] / right_total) * 100, 1)
                    }
                }
            }
            data.append(entry)
    
    return data

# Generate sample data
insole_data = generate_insole_data(7)  # 7 days of data

@app.route('/api/data')
def get_data():
    # Group steps by day
    daily_steps = {}
    foot_pressure_data = {
        'left_foot': {'inner': [], 'outer': []},
        'right_foot': {'inner': [], 'outer': []}
    }
    
    for entry in insole_data:
        # Process daily steps
        date = entry['timestamp'].split()[0]
        if date not in daily_steps:
            daily_steps[date] = 0
        daily_steps[date] += entry['steps']
        
        # Process foot pressure data
        pressure = entry['foot_pressure']
        foot_pressure_data['left_foot']['inner'].append(pressure['left_foot']['inner_pressure'])
        foot_pressure_data['left_foot']['outer'].append(pressure['left_foot']['outer_pressure'])
        foot_pressure_data['right_foot']['inner'].append(pressure['right_foot']['inner_pressure'])
        foot_pressure_data['right_foot']['outer'].append(pressure['right_foot']['outer_pressure'])
    
    # Calculate average foot pressure
    avg_foot_pressure = {
        'left_foot': {
            'inner': round(sum(foot_pressure_data['left_foot']['inner']) / len(foot_pressure_data['left_foot']['inner']), 1),
            'outer': round(sum(foot_pressure_data['left_foot']['outer']) / len(foot_pressure_data['left_foot']['outer']), 1)
        },
        'right_foot': {
            'inner': round(sum(foot_pressure_data['right_foot']['inner']) / len(foot_pressure_data['right_foot']['inner']), 1),
            'outer': round(sum(foot_pressure_data['right_foot']['outer']) / len(foot_pressure_data['right_foot']['outer']), 1)
        }
    }
    
    daily_data = [
        {
            'date': date,
            'total_steps': steps
        }
        for date, steps in daily_steps.items()
    ]
    
    return jsonify({
        'hourly_data': insole_data,
        'daily_steps': daily_data,
        'average_foot_pressure': avg_foot_pressure
    })

@app.route('/api/summary')
def get_summary():
    total_steps = sum(d['steps'] for d in insole_data)
    avg_heart_rate = sum(d['heart_rate'] for d in insole_data) / len(insole_data)
    total_calories = sum(d['calories'] for d in insole_data)
    
    # Calculate average foot pressure distribution
    left_inner = sum(d['foot_pressure']['left_foot']['inner_pressure'] for d in insole_data) / len(insole_data)
    left_outer = sum(d['foot_pressure']['left_foot']['outer_pressure'] for d in insole_data) / len(insole_data)
    right_inner = sum(d['foot_pressure']['right_foot']['inner_pressure'] for d in insole_data) / len(insole_data)
    right_outer = sum(d['foot_pressure']['right_foot']['outer_pressure'] for d in insole_data) / len(insole_data)
    
    return jsonify({
        'total_steps': total_steps,
        'average_heart_rate': round(avg_heart_rate, 1),
        'total_calories': total_calories,
        'foot_pressure_summary': {
            'left_foot': {
                'inner_pressure': round(left_inner, 1),
                'outer_pressure': round(left_outer, 1),
                'distribution': round((left_inner / (left_inner + left_outer)) * 100, 1)
            },
            'right_foot': {
                'inner_pressure': round(right_inner, 1),
                'outer_pressure': round(right_outer, 1),
                'distribution': round((right_inner / (right_inner + right_outer)) * 100, 1)
            }
        }
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
