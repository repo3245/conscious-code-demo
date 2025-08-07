import React, { Component, useState, useContext, useRef, useEffect } from "react";

import {
  FlatList,
  Animated,
  Dimensions,
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Button,
  ActivityIndicator,
  ImageBackground
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { generateMeditation } from "./meditationContext.js"; // Update with the actual path to hypnosisContext.js
import { useNavigation } from '@react-navigation/native';
import { useGetCurrentUser } from "../../../components/hooks/useGetCurrentUser.js";
import { UserContext } from "./userContext.js"; // Update with the actual path to hypnosisContext.js
import { getStorage, uploadString } from "firebase/storage";
import { getAuth } from "firebase/auth";
import {
  collection, doc, updateDoc,
  getDocs, addDoc, setDoc,
  increment, arrayUnion, ref,
  deleteDoc, getDoc, serverTimestamp,
  onSnapshot
} from "firebase/firestore";

import { db, analytics } from '../../../firebaseConfig.js';

import { useCounter, fetchallData } from './CounterContext.js';
import { useFocusEffect } from '@react-navigation/native';

import Carousel from 'react-native-snap-carousel';

import Dots from 'react-native-dots-pagination';
import AntDesign from '@expo/vector-icons/AntDesign';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const INITIALTECHNIQUE = [
  {
    id: 'progressive muscle relaxation',
    text: "Progressive muscle relaxation",
    text2: "",
    src: require('./noronha1.jpg'), // Replace with your image path
  },
  {
    id: 'deep breathing',
    text: "Deep breathing",
    text2: "",
    src: require('./shilin1.jpg'), // Replace with your image path
  },
  {
    id: 'body scan',
    text: "Body scan",
    text2: "",
    src: require('./napali1.jpg'), // Replace with your image path
  },

  // {
  //   id: 'stressRelief',
  //   text: "Stress Relief",
  //   text2: "Reducing anxiety and tension.",
  //   src: require('./stressrelief01.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'self_compassion',
  //   text: "Self-Compassion",
  //   text2: "Practicing kindness and understanding towards oneself.",
  //   src: require('./selfcompassion1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'gratitude',
  //   text: "Gratitude",
  //   text2: "Focusing on appreciation and positive emotions.",
  //   src: require('./gratitude3.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'bodyScan',
  //   text: "Body Scan",
  //   text2: "Bringing awareness to different parts of the body.",
  //   src: require('./bodyscan1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'emotionalBalance',
  //   text: "Emotional Balance",
  //   text2: "Regulating emotions and finding inner peace.",
  //   src: require('./balance1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'innerPeace',
  //   text: "Inner Peace",
  //   text2: "Cultivating a sense of tranquility and harmony.",
  //   src: require('./innerpeace1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'energyBoost',
  //   text: "Energy Boost",
  //   text2: "Increasing vitality and alertness.",
  //   src: require('./energyboost1.jpg'), // Replace with your image path
  // },
];

const ADDITIONALTECHNIQUES = [

  {
    id: 'imagining a peaceful place',
    text: "Imagining a peaceful place",
    text2: "Visualization Techniques",
    src: require('./relaxation7.jpg'), // Replace with your image path
  },
  {
    id: 'visualizing light filling the body',
    text: "Visualizing light filling the body",
    text2: "Visualization Techniques",
    src: require('./mindfulness1.jpg'), // Replace with your image path
  },
  {
    id: 'creating a safe and comforting space',
    text: "Creating a safe and comforting space",
    text2: "Visualization Techniques",
    src: require('./focus7.jpg'), // Replace with your image path
  },
  {
    id: 'box breathing',
    text: "Box breathing",
    text2: "Breathing Exercises",
    src: require('./stressrelief01.jpg'), // Replace with your image path
  },
  {
    id: 'alternate nostril breathing',
    text: "Alternate nostril breathing",
    text2: "Breathing Exercises",
    src: require('./selfcompassion1.jpg'), // Replace with your image path
  },
  {
    id: 'counting breaths',
    text: "Counting breaths",
    text2: "Breathing Exercises",
    src: require('./gratitude3.jpg'), // Replace with your image path
  },
  {
    id: 'focusing on specific body parts',
    text: "Focusing on specific body parts",
    text2: "Body Awareness",
    src: require('./bodyscan1.jpg'), // Replace with your image path
  },
  {
    id: 'positive affirmations',
    text: "Positive affirmations",
    text2: "Affirmations and Mantras",
    src: require('./balance1.jpg'), // Replace with your image path
  },
  {
    id: 'repeating mantras',
    text: "Repeating Mantras",
    text2: "Affirmations and Mantras",
    src: require('./innerpeace1.jpg'), // Replace with your image path
  },
  {
    id: 'journeying through a forest',
    text: "Journeying through a forest",
    text2: "Guided Imagery",
    src: require('./energyboost1.jpg'), // Replace with your image path
  },
  {
    id: 'floating on a cloud',
    text: "Floating on a cloud",
    text2: "Guided Imagery",
    src: require('./fundy1.jpg'), // Replace with your image path
  },
  {
    id: 'walking through a garden',
    text: "Walking through a garden",
    text2: "Guided Imagery",
    src: require('./mulino1.jpg'), // Replace with your image path
  },
  {
    id: 'observing thoughts without judgment',
    text: "Observing thoughts without judgment",
    text2: "Mindfulness Techniques",
    src: require('./siwa1.jpg'), // Replace with your image path
  },
  {
    id: 'focusing on the present moment',
    text: "Focusing on the present moment",
    text2: "Mindfulness Techniques",
    src: require('./verdon1.jpg'), // Replace with your image path
  },
  {
    id: 'noticing the sensations of breathing',
    text: "Noticing the sensations of breathing",
    text2: "Mindfulness Techniques",
    src: require('./pembrokeshire1.jpg'), // Replace with your image path
  },
  {
    id: 'feeling the feet on the ground',
    text: "Feeling the feet on the ground",
    text2: "Grounding Techniques",
    src: require('./jeita1.jpg'), // Replace with your image path
  },
  {
    id: 'sensing the connection to the earth',
    text: "Sensing the connection to the earth",
    text2: "Grounding Techniques",
    src: require('./moher1.jpg'), // Replace with your image path
  },
  {
    id: 'engaging the five senses (sight, sound, smell, touch, taste)',
    text: "Engaging the five senses",
    text2: "Grounding Techniques",
    src: require('./shilin1.jpg'), // Replace with your image path
  },
  {
    id: 'acknowledging and naming emotions',
    text: "Acknowledging and naming emotions",
    text2: "Emotional Processing",
    src: require('./napali1.jpg'), // Replace with your image path
  },
  {
    id: 'letting go of negative emotions',
    text: "Letting go of negative emotions",
    text2: "Emotional Processing",
    src: require('./noronha1.jpg'), // Replace with your image path
  },
  {
    id: 'cultivating positive emotions',
    text: "Cultivating positive emotions",
    text2: "Emotional Processing",
    src: require('./plitvice1.jpg'), // Replace with your image path
  },
];


const DESIREDTONED = [

  {
    id: 'calming',
    text: "Calming",
    text2: "Desired tone",
    src: require('./paria1.jpg'), // Replace with your image path
  },
  {
    id: 'soothing',
    text: "Soothing",
    text2: "Desired tone",
    src: require('./uluru-ayers1.jpg'), // Replace with your image path
  },
  {
    id: 'uplifting',
    text: "Uplifting",
    text2: "Desired tone",
    src: require('./halong1.jpg'), // Replace with your image path
  },
  // {
  //   id: 'stressRelief',
  //   text: "Stress Relief",
  //   text2: "Reducing anxiety and tension.",
  //   src: require('./stressrelief01.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'self_compassion',
  //   text: "Self-Compassion",
  //   text2: "Practicing kindness and understanding towards oneself.",
  //   src: require('./selfcompassion1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'gratitude',
  //   text: "Gratitude",
  //   text2: "Focusing on appreciation and positive emotions.",
  //   src: require('./gratitude3.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'bodyScan',
  //   text: "Body Scan",
  //   text2: "Bringing awareness to different parts of the body.",
  //   src: require('./bodyscan1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'emotionalBalance',
  //   text: "Emotional Balance",
  //   text2: "Regulating emotions and finding inner peace.",
  //   src: require('./balance1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'innerPeace',
  //   text: "Inner Peace",
  //   text2: "Cultivating a sense of tranquility and harmony.",
  //   src: require('./innerpeace1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'energyBoost',
  //   text: "Energy Boost",
  //   text2: "Increasing vitality and alertness.",
  //   src: require('./energyboost1.jpg'), // Replace with your image path
  // },
];


const ENDINGAFFIRMATIONS = [

  {
    id: 'positive affirmations',
    text: "Positive Affirmations",
    text2: "Ending technique",
    src: require('./lauterbrunnen1.jpg'), // Replace with your image path
  },
  {
    id: 'repeating mantras',
    text: "Repeating Mantras",
    text2: "Ending technique",
    src: require('./uyuni1.jpg'), // Replace with your image path
  },
  {
    id: 'calm conclusion',
    text: "Calm Conclusion",
    text2: "Ending technique",
    src: require('./fundy1.jpg'), // 9/2/2024 Change images after these eventually
  },
  // {
  //   id: 'stressRelief',
  //   text: "Stress Relief",
  //   text2: "Reducing anxiety and tension.",
  //   src: require('./stressrelief01.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'self_compassion',
  //   text: "Self-Compassion",
  //   text2: "Practicing kindness and understanding towards oneself.",
  //   src: require('./selfcompassion1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'gratitude',
  //   text: "Gratitude",
  //   text2: "Focusing on appreciation and positive emotions.",
  //   src: require('./gratitude3.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'bodyScan',
  //   text: "Body Scan",
  //   text2: "Bringing awareness to different parts of the body.",
  //   src: require('./bodyscan1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'emotionalBalance',
  //   text: "Emotional Balance",
  //   text2: "Regulating emotions and finding inner peace.",
  //   src: require('./balance1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'innerPeace',
  //   text: "Inner Peace",
  //   text2: "Cultivating a sense of tranquility and harmony.",
  //   src: require('./innerpeace1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'energyBoost',
  //   text: "Energy Boost",
  //   text2: "Increasing vitality and alertness.",
  //   src: require('./energyboost1.jpg'), // Replace with your image path
  // },
];


const SPECIFICDETAILS = [

  {
    id: 'peaceful garden visualization',
    text: "Peaceful Garden Visualization",
    text2: "Specific Details",
    src: require('./mulino1.jpg'), // Replace with your image path
  },
  {
    id: 'breath counting',
    text: "Breath Counting",
    text2: "Specific Details",
    src: require('./siwa1.jpg'), // Replace with your image path
  },
  {
    id: 'grounding sensations',
    text: "Grounding Sensations",
    text2: "Specific Details",
    src: require('./verdon1.jpg'), // Replace with your image path
  },
  // {
  //   id: 'stressRelief',
  //   text: "Stress Relief",
  //   text2: "Reducing anxiety and tension.",
  //   src: require('./stressrelief01.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'self_compassion',
  //   text: "Self-Compassion",
  //   text2: "Practicing kindness and understanding towards oneself.",
  //   src: require('./selfcompassion1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'gratitude',
  //   text: "Gratitude",
  //   text2: "Focusing on appreciation and positive emotions.",
  //   src: require('./gratitude3.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'bodyScan',
  //   text: "Body Scan",
  //   text2: "Bringing awareness to different parts of the body.",
  //   src: require('./bodyscan1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'emotionalBalance',
  //   text: "Emotional Balance",
  //   text2: "Regulating emotions and finding inner peace.",
  //   src: require('./balance1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'innerPeace',
  //   text: "Inner Peace",
  //   text2: "Cultivating a sense of tranquility and harmony.",
  //   src: require('./innerpeace1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'energyBoost',
  //   text: "Energy Boost",
  //   text2: "Increasing vitality and alertness.",
  //   src: require('./energyboost1.jpg'), // Replace with your image path
  // },
];


const MEDITATIONFLOW = [

  {
    id: 'body scan flow',
    text: "Body Scan Flow",
    text2: "Meditation Flow",
    src: require('./pembrokeshire1.jpg'), // Replace with your image path
  },
  {
    id: 'visualization transition',
    text: "Visualization Transition",
    text2: "Meditation Flow",
    src: require('./jeita1.jpg'), // Replace with your image path
  },
  {
    id: 'mindful breathing',
    text: "Mindful Breathing",
    text2: "Meditation Flow",
    src: require('./moher1.jpg'), // Replace with your image path
  },
  // {
  //   id: 'stressRelief',
  //   text: "Stress Relief",
  //   text2: "Reducing anxiety and tension.",
  //   src: require('./stressrelief01.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'self_compassion',
  //   text: "Self-Compassion",
  //   text2: "Practicing kindness and understanding towards oneself.",
  //   src: require('./selfcompassion1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'gratitude',
  //   text: "Gratitude",
  //   text2: "Focusing on appreciation and positive emotions.",
  //   src: require('./gratitude3.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'bodyScan',
  //   text: "Body Scan",
  //   text2: "Bringing awareness to different parts of the body.",
  //   src: require('./bodyscan1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'emotionalBalance',
  //   text: "Emotional Balance",
  //   text2: "Regulating emotions and finding inner peace.",
  //   src: require('./balance1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'innerPeace',
  //   text: "Inner Peace",
  //   text2: "Cultivating a sense of tranquility and harmony.",
  //   src: require('./innerpeace1.jpg'), // Replace with your image path
  // },
  // {
  //   id: 'energyBoost',
  //   text: "Energy Boost",
  //   text2: "Increasing vitality and alertness.",
  //   src: require('./energyboost1.jpg'), // Replace with your image path
  // },
];


const MeditationTechniques = ({ route }) => {
  // Set up state for each input field
  const [meditation, setMeditation] = useState('Meditation');

  const navigation = useNavigation();

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const [showPickerExample2, setShowPickerExample2] = useState(false);
  const [alarmStringExample2, setAlarmStringExample2] = useState("0:00");
  const [soundInSec, setSoundInSec] = useState(0);

  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isAudioPlayerActive, setIsAudioPlayerActive] = useState(false);


  const [counter, setCounter] = useState(false);

  const { timestamps } = useCounter();
  console.log("Counter:", counter)
  console.log("Timestamps:", timestamps)

  const [currentTimestamps, setCurrentTimestamps] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);


  const [shouldRunFunction, setShouldRunFunction] = useState(false);
  console.log("shouldRunFunction1:", shouldRunFunction)

  const [firstPressTimestamp, setfirstPressTimestamp] = useState(null)

  const [preRatingEffect, setpreRatingEffect] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const [active, setActive] = useState(1);

  const [initialTechniques, setInitialTechniques] = useState("Initial Techniques")
  const [additionalTechniques, setAdditionalTechniques] = useState(false)
  const [desiredTone, setDesiredTone] = useState(false)
  const [endingAffirmations, setEndingAffirmations] = useState(false)
  const [specificDetails, setSpecificDetails] = useState(false)
  const [meditationFlow, setMeditationFlow] = useState(false)


  const [initialOption, setInitialOption] = useState()
  console.log("initialOption2 is currently (category selection):", initialOption)

  console.log('Session ID20:', { sessionID: sessionID });


  const { meditationTheme } = route.params;
  console.log("meditationTheme is currently:", meditationTheme)
  const { soundAdded } = route.params;
  const { sessionID: sessionID } = route.params;

  const [selectedItems, setSelectedItems] = useState([]);
  const [sortedSelectedItems, setSortedSelectedItems] = useState([]);


  useEffect(() => {
    // Set the initial option to "Initial Techniques" when the component mounts
    setInitialOption("Initial Techniques");
  }, []);


  const options = [
    {
      id: 'Initial Techniques',
      text: 'Initial Techniques',
      text2: '',
      padding: 15,
      function: setInitialTechniques
    },
    {
      id: 'Additional Techniques',
      text: 'Additional Techniques',
      text2: '',
      padding: 20,
      function: setAdditionalTechniques
    },
    {
      id: 'Desired Tone',
      text: 'Desired Tone',
      text2: '',
      padding: 4,
      function: setDesiredTone
    },
    {
      id: 'Ending Affirmations',
      text: 'Ending Affirmations',
      text2: '',
      padding: 18,
      function: setEndingAffirmations
    },
    {
      id: 'Specific Details',
      text: 'Specific Details',
      text2: '',
      padding: 10,
      function: setSpecificDetails
    },
    {
      id: 'Meditation Flow',
      text: 'Meditation Flow',
      text2: '',
      padding: 8,
      function: setMeditationFlow
    },

  ]


  useFocusEffect(
    React.useCallback(() => {

      const fetchallData = (user) => {
        const TCDocRef = doc(db, 'TimestampsCounter', user.uid);
        // const DocRef = doc(TCDocRef)
        const unsubscribe = onSnapshot(TCDocRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            const counter = [];
            counter.push(data.counter);
            setCounter(counter);

          }


          // You still need the Timestamps sent to the context

          // console.log("CounterDocData:", doc.data());

          console.log("CounterData is now:", counter)
          // setTimestamps(doc.data().timestamps)
        });

        return unsubscribe;
      };
      fetchallData(user)

    }, [user]) // Include dependencies that trigger the effect when they change
  );



  // useFocusEffect(
  //   React.useCallback(() => {

  //     fetchallData(user);

  //   }, [user]) // Include dependencies that trigger the effect when they change
  // );



  // Counter and Timestamps aren't being registered

  const fadeAnim = useRef(new Animated.Value(0)).current;  // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 2000,  // Fade in over 2 seconds
        useNativeDriver: true,
      }
    ).start();
  }, [fadeAnim])


  useEffect(() => {

    if (counter >= 10 && !shouldRunFunction) {
      setIsButtonDisabled(true);
      console.log("Button disabled")
    } else {
      setIsButtonDisabled(false);

      console.log("Button not disabled")
      console.log("firstPressTimestamp output:", firstPressTimestamp)
      console.log("Counter not met limit yet:", counter)

    }
  }, [counter, shouldRunFunction]);


  const firstPress = async () => {
    const firstPressTimestamp = Date.now();
    const documentRef = doc(db, 'InitialTimestamp', user.uid);

    await setDoc(documentRef, {
      firstPressTimestamp: firstPressTimestamp,

    }, { merge: true })
      .then(() => {
        // setCounter(counter + 1);
        console.log("Logged Initial Timestamp:", firstPressTimestamp)
        console.log(firstPressTimestamp)

        setfirstPressTimestamp(firstPressTimestamp)

      })
      .catch(error => {
        console.error("Error updating counter: ", error);

      });

  }


  useEffect(() => {
    if (counter == 1) {
      firstPress();
    }
  }, [counter]);

  async function deleteDocuments(db, docPath, uid) {
    await deleteDoc(doc(db, `${docPath}${uid}`));
  }

  // useEffect(() => {

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const docRef = doc(db, 'InitialTimestamp', user.uid);
        const docSnap = await getDoc(docRef);
        console.log("First fetchData click") // The bug is that the initialTimestamp isn't created when the user clicks on the generate button the first time
        // I think it's this function: firstPress()

        if (docSnap.exists()) { // What if there is no timestamp?
          const data = docSnap.data();
          const firstPressTimestamp = data.firstPressTimestamp;
          console.log("Test1:", firstPressTimestamp) ///////////////////////////// Why does this have an input but the other one is null?
          // it's not in the useState variable but in Firebase

          setfirstPressTimestamp(firstPressTimestamp)
          const now = Date.now();

          // const threeHoursAgo = now - 3 * 60 * 60 * 1000;
          // if (firstPressTimestamp > threeHoursAgo) {
          // const twoMinutesAgo = now - 2 * 60 * 1000;

          // if ( firstPressTimestamp > twoMinutesAgo ) {  // Change this
          // const twoHoursAgo = now - 2 * 60 * 60 * 1000;

          const twoHoursAgo = now - 2 * 60 * 60 * 1000;
          if (firstPressTimestamp > twoHoursAgo) {

            //       const tenMinutesAgo = now - 10 * 60 * 1000;
            // if (firstPressTimestamp > tenMinutesAgo) {  /////////////////////////////////// Erase: 10:36AM and change


            // The firstPress was less than 3 hours ago
            // firstPress button is only active if threeHoursAgo is true -- activate firstPress



            setShouldRunFunction(false)
            console.log("shouldRunFunction2:", shouldRunFunction)


            // setIsButtonDisabled(true);




            // After erasing the counter and firstPress, then activate
            // firstPress again


            // Update the state of your app accordingly

          } else {
            // The last action was more than 3 hours ago
            // Erase counter
            deleteDocuments(db, 'TimestampsCounter/', user.uid);
            console.log("Documents Deleted")
            // Erase firstPress timestamp
            deleteDocuments(db, 'InitialTimestamp/', user.uid);
            console.log("Documents Deleted")

            // WARN  Possible Unhandled Promise Rejection (id: 11):
            // FirebaseError: Invalid collection reference. Collection references must have an odd number of segments, but TimestampsCounter/3Tz6h4tOmQNN77o4RHNXFfAWOc83 has 2.
            //   FirebaseError: [code = invalid - argument]: Invalid collection reference.Collection references must have an odd number of segments, but TimestampsCounter / 3Tz6h4tOmQNN77o4RHNXFfAWOc83 has 2.


            setShouldRunFunction(true)
            console.log("shouldRunFunction3:", shouldRunFunction)


            // setIsButtonDisabled(false);


            firstPress()
            // Update the state of your app accordingly

            // Ignore, you can send off a message
          }
        }
        // else {
        //   console.log("No such document!");

        // }
      };

      fetchData()

    }, [counter]) // Include dependencies that trigger the effect when they change
  );


  console.log('soundInSec:', soundInSec);


  const { preRating } = route.params;

  console.log("preRating:", preRating);


  const { user, error } = useContext(UserContext);
  console.log(user);


  const FadeInView = (props) => {
    const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0

    useEffect(() => {
      Animated.timing(
        fadeAnim,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }
      ).start();
    }, [fadeAnim])

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
        }}
      >
        {props.children}
      </Animated.View>
    );
  }


  const getText = (item) => {
    return item.text;
  }

  const getText2 = (item) => {
    return item.text2;
  }




  const handleItemPress = (id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(id)) {
        console.log("Item is already selected:", id);
        return prevSelectedItems; // Return the same array if item is already selected
      }
      const newSelectedItems = [...prevSelectedItems, id];
      console.log("Previous selected items:", prevSelectedItems);
      console.log("New selected item:", id);
      console.log("Updated selected items:", newSelectedItems);
      return newSelectedItems; // Add the item id to the selected items array
    });
  };

  const handleMinusPress = (id) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = prevSelectedItems.filter((itemId) => itemId !== id);
      console.log("Removed item ID:", id);
      console.log("Updated selected items:", newSelectedItems);
      return newSelectedItems;
    });
  };





  const renderItemOptions = ({ item, index }) => {
    return (
      <View
        style={{
          height: 80,
          justifyContent: 'center',
          paddingHorizontal: 3,
          marginTop: -15
        }}
      >

        <TouchableOpacity
          onPress={() => {
            setInitialOption(item.id);
            console.log("Initial Option is currently:", initialOption)
          }}
        >

          <View
            style={[
              {
                borderColor: initialOption === item.id ? "#FFE500" : "black",
                // borderColor: "white",
                borderWidth: 2.5,
                borderRadius: 38,
                marginBottom: -10,
                paddingHorizontal: item.padding,
                paddingVertical: 9,

              }
            ]}
          >

            <Text
              adjustsFontSizeToFit={true}
              textBreakStrategy="simple"
              style={{
                fontStyle: "italic",
                fontSize: 14.5,
                fontWeight: 600,
                letterSpacing: .65,
                width: 90,
                alignItems: "center",
                textAlign: "center"

              }}
            >
              {item.text}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

    )
  }

  // 7/22/2025

  const renderItem = ({ item, index }) => {
    const isSelected = selectedItems.includes(item.id);
    return (
      <View style={{
        height: 235,
        shadowColor: "#000",
        shadowOpacity: 0.9,
        shadowOffset: { width: 50, height: 5 },
        shadowRadius: 30,
        elevation: 12,
        backgroundColor: '#fff',
        overflow: "visible",
        borderRadius: 32,
        marginBottom: 25
      }}>
        {/* onPress={() =>
                        navigation.navigate("HypnosisAudioScreenRoute", {
                          itemid: item.id,
                          promptTemplate: promptTemplate
                        })
                      } */}


        <View
          style={{
            position: "absolute",
            zIndex: 1,
            right: 28,
            top: 162
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (isSelected) {
                handleMinusPress(item.id);
              } else {
                handleItemPress(item.id);
              }
            }}
          >
            {isSelected ? (
              <AntDesign name="minuscircleo" size={46.5} color="white" />
            ) : (
              <AntDesign name="pluscircleo" size={46.5} color="white" />
            )}
          </TouchableOpacity>
        </View>

        <View
          style={{
            position: "absolute",
            zIndex: 1,
            top: 25,
            left: 40,


          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 29,
              fontStyle: "italic",
              fontWeight: 800,
              letterSpacing: .7,
              textAlign: "left",
              width: 320,
              right: 10

            }}
          >
            {item.text}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            // navigation.navigate("homeScreen",
            //   { meditationTheme: item.text }
            // ); 
            handleItemPress(item.id);
            // setScreenName(item.id)
            console.log("Selected option is:", item.id);
            console.log("Total selected options are:", selectedItems);
          }}
        >
          <Image
            source={item.src}
            style={{
              width: windowWidth - 35,
              height: 235,
              borderRadius: 32,

            }}
          />
        </TouchableOpacity>

      </View>
    );
  };


  // Conditional data assignment
  let data = INITIALTECHNIQUE;
  switch (initialOption) {
    case 'Initial Techniques':
      data = INITIALTECHNIQUE;
      break;
    case 'Additional Techniques':
      data = ADDITIONALTECHNIQUES;
      break;
    case 'Desired Tone':
      data = DESIREDTONED;
      break;
    case 'Ending Affirmations':
      data = ENDINGAFFIRMATIONS;
      break;
    case 'Specific Details':
      data = SPECIFICDETAILS;
      break;
    case 'Meditation Flow':
      data = MEDITATIONFLOW;
      break;
    default:
      data = INITIALTECHNIQUE;
  }


  const categorizeSelectedItems = (selectedItems) => {
    const categories = {
      initialTechniques: [],
      additionalTechniques: [],
      desiredTone: [],
      endingAffirmations: [],
      specificDetails: [],
      meditationFlow: [],
    };

    selectedItems.forEach((itemId) => {
      if (INITIALTECHNIQUE.some(item => item.id === itemId)) {
        categories.initialTechniques.push(itemId);
      } else if (ADDITIONALTECHNIQUES.some(item => item.id === itemId)) {
        categories.additionalTechniques.push(itemId);
      } else if (DESIREDTONED.some(item => item.id === itemId)) {
        categories.desiredTone.push(itemId);
      } else if (ENDINGAFFIRMATIONS.some(item => item.id === itemId)) {
        categories.endingAffirmations.push(itemId);
      } else if (SPECIFICDETAILS.some(item => item.id === itemId)) {
        categories.specificDetails.push(itemId);
      } else if (MEDITATIONFLOW.some(item => item.id === itemId)) {
        categories.meditationFlow.push(itemId);
      }
    });

    return categories;
  };

  const prepareDataForAPI = (categorizedItems) => {
    return {
      meditationTheme: meditationTheme,
      initialTechniques: categorizedItems.initialTechniques,
      additionalTechniques: categorizedItems.additionalTechniques,
      desiredTone: categorizedItems.desiredTone,
      endingAffirmations: categorizedItems.endingAffirmations,
      specificDetails: categorizedItems.specificDetails,
      meditationFlow: categorizedItems.meditationFlow,
    };
  };

  // const sendDataToBackend = async (data) => {
  //   try {
  //     const response = await generateAudio(data, user.uid);
  //     console.log('Data sent successfully:', response.data);
  //   } catch (error) {
  //     console.error('Error sending data:', error);
  //   }
  // };

  const handleSendData = () => { /////////////////////////////////
    const categorizedItems = categorizeSelectedItems(selectedItems);
    console.log("Categorized Items:", categorizedItems)
    const dataForAPI = prepareDataForAPI(categorizedItems);
    console.log("dataForAPI:", dataForAPI)
    // sendDataToBackend(dataForAPI);
  };



  const DateCounter = async () => {
    const CounterDoc = doc(db, "DateCounter", user.uid);

    const counterSnapshot = await getDoc(CounterDoc);
    let currentCounter;
    let dates;

    if (counterSnapshot.exists()) {
      // Document exists, get the current counter and dates
      currentCounter = counterSnapshot.data().counter;
      dates = counterSnapshot.data().dates;
    } else {
      // Document does not exist, initialize counter and dates
      currentCounter = 0;
      dates = {};
    }

    await setDoc(CounterDoc, {
      counter: increment(1),
      dates: {
        ...dates,
        [currentCounter + 1]: serverTimestamp(),
      },
    }, { merge: true });

    console.log("DateCounter is now:", currentCounter + 1);
  }


  // Function to handle form submission
  async function handleGenerateAudio() {
    DateCounter()
    setIsAudioPlayerActive(true); // Activate button
    setIsAudioLoaded(false); // Set loading state

    const categorizedItems = categorizeSelectedItems(selectedItems);
    const dataForAPI = prepareDataForAPI(categorizedItems);

    console.log("Categorized Items:", categorizedItems)
    console.log("dataForAPI:", dataForAPI)

    try {
      // Reference to the specific session document
      // const sessionDocRef = doc(db, 'Ratings', user.uid, 'Sessions', sessionID);

      // // Update the document with new data
      // await updateDoc(sessionDocRef, {
      //   hypnosisType: typeOfHypnosis,
      //   soundAdded: soundAdded, // Store as boolean
      //   soundInSeconds: soundInSec,
      //   promptTemplate: promptTemplate,
      //   soundSelected: soundSelectedName,
      //   // cuesSelected: cuesSelected, // Uncomment if you want to store this data as well
      // });

      // console.log('Session data updated successfully.');

      // const requestData = {
      //   type_of_hypnosis: typeOfHypnosis,
      //   sound_added: soundAdded,
      //   sound_in_sec: soundInSec,
      //   prompt_template: promptTemplate,
      //   sound_selected_name: soundSelectedName,
      //   cues_selected: cuesSelected,

      // };

      console.log("Current user.uid:", user.uid)


      const response = await generateMeditation(dataForAPI, user.uid); // 
      console.log("The response is:", response);


      navigation.navigate('HypnosisAudioScreen', { audioUrl: response.result.merged_file_final_path, sessionID: sessionID, promptTemplate });


      setIsAudioLoaded(true); // Set loaded state

      if (response) {

        const newTimestamp = Date.now();
        // There are a lot of changes with the timestamps


        // setTimestamps([...timestamps, newTimestamp]);
        // const userFavoritesDocRef = doc(db, 'Favoritesdoc', user.uid);
        // const FavoriteDocRef = collection(userFavoritesDocRef, "favorites");


        // Assuming 'counter' is a field in a document in your Firebase Firestore
        const documentRef = doc(db, 'TimestampsCounter', user.uid);

        // const DocRef = collection(TCDocRef, "TC");
        // const docRef = await addDoc(FavoriteDocRef, newFavoriteData);
        await setDoc(documentRef, {
          counter: increment(1),

        }, { merge: true })
          .then(() => {
            // setCounter(counter + 1);
            console.log("Incremented")

          })
          .catch(error => {
            console.error("Error updating counter: ", error);

          });

        const docuTSRef = doc(db, 'Timestamps', user.uid);
        await setDoc(docuTSRef, {
          timestamps: arrayUnion(newTimestamp), //make into actual timestamp
        }, { merge: true })
          .then(() => {
            // setCounter(counter + 1);
            console.log("Timestamp Added")

          })
          .catch(error => {
            console.error("Error adding timestamp: ", error);
          });
      }

    } catch (error) {
      console.error('Error updating session data:', error);
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <View >

        <View style={{ paddingBottom: 10 }}>
          <TouchableOpacity onPress={navigation.navigate('')}>
            <AntDesign
              style={{
                right: -15,
                top: 15
              }}
              name="arrowleft"
              size={36}
              color="black" />
          </TouchableOpacity>
        </View>

        <View style={{
          paddingTop: 20,
          overflow: 'visible'
        }}>

          <View
            style={{
              alignItems: 'flex-start',
              paddingLeft: 19,
              marginBottom: -10
            }}
          >
            <Text style={{
              color: "#FFE500",
              fontStyle: "italic",
              fontSize: 31,
              fontWeight: "800"

            }}>Meditation</Text>
            <Text style={{
              fontStyle: "italic",
              fontSize: 38.75,
              fontWeight: "900",
              width: 200
            }}>Session Select</Text>

          </View>

          {/* 7/25/2025 */}

          <View
            style={{
              height: 200
            }}
          />

          <View
            style={{
              height: 160,
            }}
          >
            <FlatList
              style={{
                top: -155,
                width: windowWidth
              }}
              contentContainerStyle={{
                flex: 1,
                alignItems: 'center'
              }}
              numColumns={3}
              data={options}
              renderItem={({ item, index }) => renderItemOptions({ item, index })}
              scrollEnabled={false}
            />
          </View>

          <View
            style={{
              top: 670,
              left: 332,
              height: 69,
              width: 69,
              borderRadius: 15,
              position: "absolute",
              zIndex: 999,
              backgroundColor: "#f9f7f2",
              shadowColor: "#000",
              shadowOpacity: 0.9,
              shadowOffset: { width: 50, height: 5 },
              shadowRadius: 30,
              elevation: 12,
            }}
          >

            {!isAudioPlayerActive && (
              <TouchableOpacity
                onPress={() => { handleGenerateAudio() }}
              >
                <AntDesign
                  style={{
                    right: -15,
                    top: 15
                  }}
                  name="arrowright"
                  size={36}
                  color="black" />
              </TouchableOpacity>
            )}


            {isAudioPlayerActive && !isAudioLoaded && (
              <Animated.View style={{
                opacity: fadeAnim,
                flex: 1,
                justifyContent: 'center'
              }}>
                <ActivityIndicator size="large" color="#000" />
              </Animated.View>
            )}


            {isAudioLoaded && isAudioPlayerActive && (
              <TouchableOpacity>
                <AntDesign
                  style={{
                    right: -15,
                    top: 15
                  }}
                  name="arrowright"
                  size={36}
                  color="black" />
              </TouchableOpacity>
            )}

          </View>

          <FlatList
            style={{
              top: -170,
              height: 485
            }}

            contentContainerStyle={{
              alignItems: 'center'
            }}

            vertical
            data={data}
            renderItem={({ item, index }) => renderItem({ item, index })}
            keyExtractor={(item) => item.id}
          />


        </View>
      </View>
    </SafeAreaView >

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "#f9f7f2ff",
    overflow: 'visible',
  },


});


export default MeditationTechniques;
