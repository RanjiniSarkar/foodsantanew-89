import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {RFValue} from 'react-native-responsive-fontsize'
import {Icon} from 'react-native-elements'

export default class FoodRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      foodName:"",
      healthIssues:"",
      IsFoodRequestActive : "",
      requestedFoodName: "",
      Foodstatus:"",
      requestId:"",
      userDocId: '',
      docId :'',
      value:'',
      currencyCode:""
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addRequest =(foodName,healthIssues)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_food').add({
        "user_id": userId,
        "food_name":foodName,
        "health_issues":healthIssues,
        "request_id"  : randomRequestId,
        "food_status": "requested",
        "value":this.state.value,
        "date"       : firebase.firestore.FieldValue.serverTimestamp(),
    });

   getFoodRequest()
    db.collection('users').where("email_id","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
      IsFoodRequestActive: true
      })
    })
  })


    this.setState({
        foodName :'',
        healthIssues : '',
        value:'',
        requestId: randomRequestId
    })

    return Alert.alert("Food Requested Successfully")


  }

receivedFood=(foodName)=>{
  var userId = this.state.userId
  var requestId = this.state.requestId
  db.collection('received_food').add({
      "user_id": userId,
      "food_name":foodName,
      "request_id"  : requestId,
      "foodStatus"  : "received",

  })
}




getIsFoodRequestActive(){
  db.collection('users')
  .where('email_id','==',this.state.userId)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
      this.setState({
        IsFoodRequestActive:doc.data().IsFoodRequestActive,
        userDocId : doc.id,
        currencyCode: doc.data().currency_code
      })
    })
  })
}










getFoodRequest= ()=> {
  
var foodRequest =  db.collection('requested_food')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().food_status !== "received"){
        this.setState({
          requestId : doc.data().request_id,
          requestedFoodName: doc.data().food_name,
          foodStatus:doc.data().food_status,
          value:doc.data().value,
          docId     : doc.id
        })
      }
    })
})}



sendNotification=()=>{
  //to get the first name and last name
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().first_name
      var lastName = doc.data().last_name

    
      db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var donorId  = doc.data().donor_id
          var foodName =  doc.data().food_name

          //targert user id is the donor id to send notification to the user
          db.collection('all_notifications').add({
            "targeted_user_id" : donorId,
            "message" : name +" " + lastName + " received the food " + foodName ,
            "notification_status" : "unread",
            "food_name" : foodName
          })
        })
      })
    })
  })
}
getData(){
  fetch("http://data.fixer.io/api/latest?access_key=1f7dd48123a05ae588283b5e13fae944&format=1")
  .then(response=>{
    return response.json();
  }).then(responseData =>{
    var currencyCode = this.state.currencyCode
    var currency = responseData.rates.INR
    var value =  69 / currency
    console.log(value);
  })
  }


componentDidMount(){
  this.getFoodRequest()
  this.getIsFoodRequestActive()
  this.getData()

}

updateFoodRequestStatus=()=>{
  
  db.collection('requested_food').doc(this.state.docId)
  .update({
    food_status : 'recieved'
  })

  //getting the  doc id to update the users doc
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      //updating the doc
      db.collection('users').doc(doc.id).update({
        IsFoodRequestActive: false
      })
    })
  })


}


  render(){

    if(this.state.IsFoodRequestActive === true){
      return(

        // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Food Name</Text>
          <Text
          style = {{
            fontSize:RFValue(20),
            fontWeight:"bold",
            textAlign:"center",
            padding:RFValue(10)
          }}
          >{this.state.requestedFoodName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text
           style = {{
            fontSize:RFValue(25),
            fontWeight:"bold",
            textAlign:"flex-start",
            marginTop:RFValue(10)
          }}
          > Food Status </Text>

          <Text
           style = {{
            fontSize:RFValue(18),
            fontWeight:"bold",
            marginTop:RFValue(30)
          }}
          >{this.state.foodStatus}</Text>
          </View>
          
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
         <Text> Item Value </Text>

         <Text>{this.state.value}</Text>
          </View>


          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateFoodRequestStatus();
            this.receivedFood(this.state.requestedFoodName)
          }}>
          <Text>I recieved the food </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {
    return(
      // Form screen
        <View style={{flex:1}}>
          <MyHeader title="Request Food" navigation ={this.props.navigation}/>

          <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter food name"}
                onChangeText={(text)=>{
                    this.setState({
                        foodName:text
                    })
                }}
                value={this.state.foodName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Do you have any health isssues?"}
                onChangeText ={(text)=>{
                    this.setState({
                      healthIssues:text
                    })
                }}
                value ={this.state.healthIssues}
              />
               <TextInput
            style={styles.formTextInput}
            placeholder ={"Value"}
            maxLength ={8}
            onChangeText={(text)=>{
              this.setState({
                value: text
              })
            }}
            value={this.state.value}
          />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{ this.addRequest(this.state.foodName,this.state.healthIssues);
                }}
                >

                <Text>Request</Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'blue',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff00c3",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)