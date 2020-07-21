import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';
import {RFValue} from 'react-native-responsive-fontsize'
import db from '../config.js';


export default class RecieverDetailsScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      userId          : firebase.auth().currentUser.email,
      userName        : "",
      recieverId      : this.props.navigation.getParam('details')["user_id"],
      requestId       : this.props.navigation.getParam('details')["request_id"],
      foodName        : this.props.navigation.getParam('details')["food_name"],
      healthIssues    : this.props.navigation.getParam('details')["health_issues"],
      recieverName    : '',
      recieverContact : '',
      recieverAddress : '',
      recieverRequestDocId : ''
    }
  }



  getRecieverDetails(){
    db.collection('users').where('email_id','==',this.state.recieverId).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        this.setState({
          recieverName    : doc.data().first_name,
          recieverContact : doc.data().contact,
          recieverAddress : doc.data().address,
        })
      })
    });

    db.collection('requested_food').where('request_id','==',this.state.requestId).get()
    .then(snapshot=>{
      snapshot.forEach(doc => {
        this.setState({recieverRequestDocId:doc.id})
     })
  })}


  getUserDetails=(userId)=>{
    db.collection("users").where('email_id','==', userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        this.setState({
          userName  :doc.data().first_name + " " + doc.data().last_name
        })
      })
    })
  }

  updateFoodStatus=()=>{
    db.collection('all_donations').add({
      "food_name"           : this.state.foodName,
      "request_id"          : this.state.requestId,
      "requested_by"        : this.state.recieverName,
      "donor_id"            : this.state.userId,
      "request_status"      :  "Donor Interested"
    })
  }


  addNotification=()=>{
    var message = this.state.userName + " has shown interest in donating the food"
    db.collection("all_notifications").add({
      "targeted_user_id"    : this.state.recieverId,
      "donor_id"            : this.state.userId,
      "request_id"          : this.state.requestId,
      "food_name"           : this.state.foodName,
      "date"                : firebase.firestore.FieldValue.serverTimestamp(),
      "notification_status" : "unread",
      "message"             : message
    })
  }



  componentDidMount(){
    this.getRecieverDetails()
    this.getUserDetails(this.state.userId)
  }


    render(){
      return(
        <View style={styles.container}>
          <View style={{flex:0.1}}>
            <Header
              leftComponent ={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
              centerComponent={{ text:"Donate Food", style: { color: '#90A5A9', fontSize:RFValue(20),fontWeight:"bold", } }}
              backgroundColor = "#eaf8fe"
            />
          </View>
          <View style={{flex:0.3,
  
          paddingTop:RFValue(30),
          paddingBottom:RFValue(10)
          }}>
            <Text style= {{fontSize : 40}}>
                Food Information
               
              </Text>
              
                <Text style={{fontWeight:'bold',fontSize:RFValue(25),textAlign:"center"}}>
                  Name : {this.state.foodName}
                  </Text>
              
        
                <Text style={{fontWeight:'bold',fontSize:RFValue(15),textAlign:"center",marginTop:RFValue(15)}}>
                  Health Issues : {this.state.health_issues}</Text>
            
        
          </View>
          <View style={{flex:0.3,padding:RFValue(20)}}>
            <View style = {{flex:0.7}}>
            <Text
            style = {{fontWeight:"500",fontSize:RFValue(30)}}> Reciever Information</Text>
              
                <Text style={{fontWeight:'bold',fontSize:RFValue(20),marginTop:RFValue(30)}}>Name: {this.state.recieverName}</Text>
            
            
                <Text style={{fontWeight:'bold',fontSize:RFValue(20),marginTop:RFValue(30)}}>Contact: {this.state.recieverContact}</Text>
              
            
                <Text style={{fontWeight:'bold',fontSize:RFValue(20),marginTop:RFValue(30)}}>Address: {this.state.recieverAddress}</Text>
            
            </View>
          </View>
          <View style = {styles.buttonContainer}>
            {
              this.state.recieverId !== this.state.userId
              ?(
                <TouchableOpacity
                    style={styles.button}
                    onPress={()=>{
                      this.updateFoodStatus()
                      this.addNotification()
                      this.props.navigation.navigate('MyFoodDonations')
                    }}>
                  <Text>I want to Donate</Text>
                </TouchableOpacity>
              )
              : null
            }
          </View>
        </View>
      )
    }

}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"#0099ff"
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }
})