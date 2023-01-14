import numpy as np
import pickle

loaded_model=pickle.load(open("C:/Users/Prachi Singh/Downloads/trained_model.sav",'rb'))

input_data = (1,0,0,19,1,1,1,0,1,0,0,0,0,1,0,104,30,0,0,1,0)
input_data_as_numpy_array=np.asarray(input_data)
input_data_reshaped=input_data_as_numpy_array.reshape(1,-1)
predictions=loaded_model.predict(input_data_reshaped)

print(predictions)

if(predictions[0]==0):
  print("Negligible chances of stroke.")
else:
  print("U need to be cautious")