import json
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import tensorflow as tf
# from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
# from tensorflow.keras.optimizers import Adam
# import argparse
# import numpy as np
# import cv2
# import os
# from sklearn.model_selection import train_test_split
# from sklearn.utils import shuffle
# import time


# Machine learning model

def create_json_object():
    # Define your data as a dictionary
    user_data = {
        "user_id": "123", # from parameter
        "name": "azlie",
        "email": "azlie@gmail.com"
    }
    
    # Convert the dictionary to JSON
    json_object = json.dumps(user_data)
    
    return json_object


# X_train = []
# Y_train = []
# image_size = 150
# labels = ['glioma_tumor','meningioma_tumor','no_tumor','pituitary_tumor']
# model = tf.keras.models.Sequential([
#             tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(150, 150, 3)),
#             tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
#             tf.keras.layers.MaxPooling2D(2, 2),
#             tf.keras.layers.Dropout(0.3),
#             tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
#             tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
#             tf.keras.layers.Dropout(0.3),
#             tf.keras.layers.MaxPooling2D(2, 2),
#             tf.keras.layers.Dropout(0.3),
#             tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
#             tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
#             tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
#             tf.keras.layers.MaxPooling2D(2, 2),
#             tf.keras.layers.Dropout(0.3),
#             tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
#             tf.keras.layers.Conv2D(256, (3, 3), activation='relu'),
#             tf.keras.layers.MaxPooling2D(2, 2),
#             tf.keras.layers.Dropout(0.3),
#             tf.keras.layers.Flatten(),
#             tf.keras.layers.Dense(512, activation='relu'),
#             tf.keras.layers.Dense(512, activation='relu'),
#             tf.keras.layers.Dropout(0.3),
#             tf.keras.layers.Dense(4, activation='softmax')
#         ])
# # Train the model and save the weights only if the weights file doesn't exist
# weights_file = 'trained_model.h5'
# if not os.path.isfile(weights_file):
#     for i in labels:
#         #Remember to change folder path for training dataset
#         folderPath = os.path.join('C:/xampp/htdocs/NeuroDMS/basedata/training',i)
#         for j in os.listdir(folderPath):
#             img = cv2.imread(os.path.join(folderPath,j))
#             img = cv2.resize(img,(image_size,image_size))
#             X_train.append(img)
#             Y_train.append(i)
        
#     for i in labels:
#         #Remember to change folder path for testing dataset
#         folderPath = os.path.join('C:/xampp/htdocs/NeuroDMS/basedata/test',i)
#         for j in os.listdir(folderPath):
#             img = cv2.imread(os.path.join(folderPath,j))
#             img = cv2.resize(img,(image_size,image_size))
#             X_train.append(img)
#             Y_train.append(i)

#     X_train = np.array(X_train)
#     Y_train = np.array(Y_train)

#     X_train,Y_train = shuffle(X_train,Y_train,random_state=101)

#     X_train,X_test,y_train,y_test = train_test_split(X_train,Y_train,test_size=0.1,random_state=101)

#     y_train_new = []
#     for i in y_train:
#         y_train_new.append(labels.index(i))
#         y_train=y_train_new
#         y_train = tf.keras.utils.to_categorical(y_train)

#     y_test_new = []
#     for i in y_test:
#         y_test_new.append(labels.index(i))
#         y_test=y_test_new
#         y_test = tf.keras.utils.to_categorical(y_test)

    

#     # Compile the model
#     model.compile(loss='categorical_crossentropy',
#               optimizer=Adam(learning_rate=0.001),
#               metrics=['accuracy'])
#     model.fit(
#         X_train,
#         y_train,   
#         epochs=30,
#         validation_split=0.1
#     )
#     #Save the trained model weights
#     model.save_weights('trained_model.h5')
# else:
#     # Load the pre-trained model weights
#     model.load_weights(weights_file)

# @app.route('/MRIprediction', methods=['GET', 'POST'])
# def handle_ajax_request():
#     if request.method == "POST":
#         # Wait for a few seconds to allow the file to be fully transferred and saved
#         time.sleep(2)
#         imagefile = request.get_json()
#         if not imagefile or 'imgUrl' not in imagefile:
#             return jsonify({'error': 'Invalid image data.'})

#         filename = imagefile['imgUrl']
#         image_path = os.path.join("C:/xampp/htdocs/NeuroDMS/templates/MRI_images", filename)

#         if not os.path.isfile(image_path):
#             return jsonify({'error': 'Image file not found.'})

#         try:
#             img = cv2.imread(image_path)
#             if img is None:
#                 return jsonify({'error': 'Failed to load the image file.'})

#             img = cv2.resize(img, (150, 150))
#             img_array = np.array(img)

#             img_array = img_array.reshape(1, 150, 150, 3)

#             a = model.predict(img_array)
#             indices = a.argmax()
#             predicted_class = labels[indices]
#             probability = float(a[0][indices])

#             response = {
#                 'mri_prediction': predicted_class,
#                 'mri_percentage': probability
#             }

#             return jsonify(response)

#         except Exception as e:
#             return jsonify({'error': 'An error occurred during image processing: {}'.format(str(e))})
