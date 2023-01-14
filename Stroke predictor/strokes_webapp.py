import numpy as np
import pickle
import streamlit as st

loaded_model=pickle.load(open('C:/Users/Prachi Singh/Downloads/trained_model.sav','rb'))

def strokes_prediction(input_data):
    input_data_as_numpy_array=np.asarray(input_data)
    input_data_reshaped=input_data_as_numpy_array.reshape(1,-1)
    predictions=loaded_model.predict(input_data_reshaped)
     
    #print(predictions)

    if(predictions[0]==0):
        return "Negligible chances of stroke."
    else:
        return "U need to be cautious"

def main():
    #giving a title
    st.title('strokes_prediction web app')
    #getting the input data from the user
    #male,female,other,age,hypertension,heart_disease,married,not_married,private_job,self_employed,govt_job,child,never_worked,Residence_urban,Residence_rural,avg_glucose_level,bmi,formerly_smoked,never_smoked,smokes,no_data_for_smoking
    
    male=st.text_input("if male enter 1 else enter 0")
    female=st.text_input("if female enter 1 else enter 0")
    other=st.text_input("if no data available for gender enter 1 else 0")
    age=st.text_input("enter your age")
    hypertension=st.text_input("if hypertension enter 1 else enter 0")
    heart_disease=st.text_input("if heart_disease enter 1 else enter 0")
    married=st.text_input("if maried enter 1 else enter 0")
    not_married=st.text_input("if not_married enter 1 else enter 0")
    private_job=st.text_input("if private_job enter 1 else enter 0")
    self_employed=st.text_input("if self employed enter 1 else enter 0")
    govt_job=st.text_input("if govt_job enter 1 else enter 0")
    child=st.text_input("if child enter 1 else enter 0")
    never_worked=st.text_input("if never worked enter 1 else enter 0")
    Residence_urban=st.text_input("if urban_residence enter 1 else enter 0")
    Residence_rural=st.text_input("if rural_residence enter 1 else enter 0")
    avg_glucose_level=st.text_input("please enter your average glucose level")
    bmi=st.text_input("enter your bmi value")
    formerly_smoked=st.text_input("if formerly smoked and quit enter 1 else 0")
    never_smoked=st.text_input("if never smoked enter 1 else 0")
    smokes=st.text_input("if smokes enter 1 else 0")
    no_data_for_smoking=st.text_input("if not data available of smoking enter 1 else 0")

    diagnosis= ''
    
    # creating a button for prediction
    if st.button('strokes_prediction_result'):
        diagnosis=strokes_prediction([male,female,other,age,hypertension,heart_disease,married,not_married,private_job,self_employed,govt_job,child,never_worked,Residence_urban,Residence_rural,avg_glucose_level,bmi,formerly_smoked,never_smoked,smokes,no_data_for_smoking])
    
    st.success(diagnosis)

if __name__ == '__main__':
    main()
