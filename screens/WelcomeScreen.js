import React, {Component} from 'react';
 import{View,Text,TextInput,StyleSheet,TouchableOpacity,Alert,KeyboardAvoidingView,ScrollView,Modal} from'react-native';
 import db from '../config';
 import firebase from 'firebase';
 import FoodAnimation from '../components/Food'
 import {Icon,Input} from 'react-native-elements'
 import {RFValue} from 'react-native-responsive-fontsize'
 

 export default class WelcomeScreen extends React.Component{

    constructor(){
        super()
        this.state ={
            emailId:'',
            password:'',
            firstName:'',
            lastName:'',
            address:'',
            contact:'',
            confirmPassword:'',
            isModalVisible:'false',
            currencyCode:""
        }
    }
    userLogin = (emailId, password)=>{
        firebase.auth().signInWithEmailAndPassword(emailId, password)
        .then(()=>{
          this.props.navigation.navigate('Donate')
          
        })
        .catch((error)=> {
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage)
        })
      }
    
      userSignUp = (emailId, password,confirmPassword) =>{
        if(password !== confirmPassword){
          return Alert.alert("password doesn't match\nCheck your password.")
        }
        else{
        firebase.auth().createUserWithEmailAndPassword(emailId, password)
        .then(()=>{
          db.collection('users').add({
            'first_name': this.state.firstName,
            'last_name':this.state.lastName,
            'contact':this.state.contact,
            'email_id':this.state.emailId,
            'address':this.state.address,
            'currency_code':this.state.currencyCode
          })
          return  Alert.alert(
            'User Added Successfully',
            '',
            [
              {text: 'OK', onPress: () => this.setState({"isModalVisible" : false})},
            ]
        );
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage)
        });
      }
    }

    showModal = ()=>{
      return(
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isModalVisible}
          >
         <View style ={styles.modalContainer}>
           <ScrollView style = {{width:'100%'}}>
             <KeyboardAvoidingView style = {styles.KeyboardAvoidingView}>
               <Text style = {styles.modalTitle}>REGISTRATION</Text>
               <Icon
               type = {"materialicon"}
               name = {"cancel"}
               size = {RFValue(40)}
               color = {"red"}
               onPress = {()=>{
                 this.setState({
                   isModalVisible:false
                 })
               }}
               />
               <View>
               <Input
               style = {styles.formTextInput}
               placeholder={'First Name'}
               maxLength={8}
               onChangeText={(text)=>{
                 this.setState({
                   firstName: text
                 })
               }}
            />
            <Input
          style = {styles.formTextInput}
          placeholder={'Last Name'}
          maxLength={8}
          onChangeText={(text)=>{
            this.setState({
              lastName:text
            })
          }}  
          />
          <Input
          style = {styles.formTextInput}
          placeholder={'Contact'}
          maxLength={10}
          keyboardType={'numeric'}
          onChangeText={(text)=>{
            this.setState({
              contact:text
            })
          }}  
          />
          <Input
          style = {styles.formTextInput}
          placeholder={'Address'}
          multiline = {true}
          onChangeText={(text)=>{
            this.setState({
              address:text
            })
          }}  
          />
          <Input
          style = {styles.formTextInput}
          placeholder={'Email'}
          keyboardType={'email-address'}
          onChangeText={(text)=>{
            this.setState({
              emailId:text
            })
          }}  
          />
          <Input
          style = {styles.formTextInput}
          placeholder={'Password'}
          secureTextEntry={true}
          onChangeText={(text)=>{
            this.setState({
              password:text
            })
          }}  
          />
          <Input
          style = {styles.formTextInput}
          placeholder={'Confirm Password'}
          secureTextEntry={true}
          onChangeText={(text)=>{
            this.setState({
              confirmPassword:text
            })
          }}  
          />
           <Input
            style={styles.formTextInput}
            placeholder ={"Country currency code"}
            maxLength ={8}
            onChangeText={(text)=>{
              this.setState({
                currencyCode: text
              })
            }}
          />
          </View>
          <View style={styles.modalBackButton}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={()=>
              this.userSignUp(this.state.emailId, this.state.password, this.state.confirmPassword)
            }
          >
          <Text style={styles.registerButtonText}>REGISTER</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalBackButton}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={()=>this.setState({"isModalVisible":false})}
          >
          <Text style={{color:'#ff00b2'}}>CANCEL</Text>
          </TouchableOpacity>
          </View>
          

             </KeyboardAvoidingView>
           </ScrollView>
         </View>
        </Modal>
      )
    }
     render(){
         return(
             <View style = {styles.conatiner}> 
             <View style = {{justifyContent:'center',alignItems:'center'}}>

             </View>
             {this.showModal()}
             <View style={styles.profileContainer}> 
                 <FoodAnimation/>
                 <Text style= {styles.title}>FOOD SANTA</Text>
                 </View>
                 <View style={styles.buttonContainer}>
                 <TextInput
                 style={styles.loginBox}
                 placeholder="abc@example.com"
                 keyboardType='email-address'
                 onChangeText={(text)=>{
                     this.setState({
                         emailId:text
                     })
                 }}
                 />
                 <TextInput
                 style={styles.loginBox}
                 placeholder='password'
                 secureTextEntry
                 onChangeText={(text)=>{
                     this.setState({
                         password:text
                     })
                 }}
              />

                 <TouchableOpacity
            style={[styles.button,{marginBottom:20, marginTop:20}]}
            onPress = {()=>{
              this.userLogin(this.state.emailId, this.state.password)
            }}
            >
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={()=>{this.setState({isModalVisible:true})}}
            >
            <Text style={styles.buttonText}>SIGNUP</Text>
          </TouchableOpacity>

             </View>
                 
             </View>
         )
     }
 }
const styles = StyleSheet.create({
    conatiner:{
        flex:1,
        backgroundColor:'#0099ff'

    },
    profileContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
      },
      title :{
        fontSize:65,
        fontWeight:'300',
        paddingBottom:30,
        
      },
      loginBox:{
        width: 300,
        height: 40,
        borderBottomWidth: 1.5,
        borderColor : '#6866ff',
        fontSize: 20,
        margin:10,
        paddingLeft:10,
        borderRadius:30

      },
      KeyboardAvoidingView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
      },
      modalTitle:{
        justifyContent:'center',
        alignSelf:'center',
        fontSize:35,
        color:'#0099ff',
        margin:50
      },
      modalContainer:{
        flex:1,
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#ffff',
        marginRight:30,
        marginLeft:30,
        marginTop:80,
        marginBottom:80
      },
      formTextInput:{
        width:'75%',
        height:35,
        alignSelf:'center',
        borderColor:'#ff00b2',
        borderRadius:10,
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10
      },
      registerButton:{
        width:200,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderRadius:10,
        marginTop:30,
        borderColor:'#007fff'
      },
      registerButtonText:{
        color:'#ff00b2',
        fontSize:15,
        fontWeight:'bold'
      },
      cancelButton:{
        width:200,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        marginTop:5,
      },
      button:{
        width:300,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:25,
        backgroundColor:"#ff00c3",
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10.32,
        elevation: 16,
      },
      buttonText:{
        color:'#ffff',
        fontWeight:'200',
        fontSize:20
      },
      buttonContainer:{
        flex:1,
        alignItems:'center'
      }

})