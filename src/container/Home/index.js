import React from 'react';
import {
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {getContact} from '../../api';
import IconPerson from '../../assets/ic_person.png';
import GestureRecognizer from 'react-native-swipe-gestures';
import {Controller, useForm} from 'react-hook-form';
import {createContact} from '../../api';
import {launchImageLibrary} from 'react-native-image-picker';
import { useIsFocused } from "@react-navigation/native";

const Home = ({navigation}) => {
  const [listContact, setListContact] = React.useState([]);
  const [showModalAdd, setShowModal] = React.useState(false);
  const [photo, setPhoto] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const isFocused = useIsFocused();

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();

  React.useEffect(() => {
    getAllContact();
  }, [isFocused]);

  const getAllContact = () => {
    getContact().then(resp => {
      console.log(resp.data.data);
      setListContact(resp.data.data);
    });
  };

  const handleShowDetail = data => {
    navigation.navigate('Detail', data);
  };

  const renderItem = ({item, index}) => {
    // "https://bootdey.com/img/Content/avatar/avatar7.png"
    let imgSource = item.photo == 'N/A' ? IconPerson : {uri: item.photo};

    return (
      <TouchableOpacity opacity={0.2} onPress={() => handleShowDetail(item)}>
        <View style={styles.row}>
          <Image source={imgSource} style={styles.avatar} />
          <Text
            style={styles.name}>{`${item.firstName} ${item.lastName}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item, index) => index;

  const handleClickAdd = e => {
    reset();
    setPhoto('');
    setShowModal(true);
  };

  const handleClickSubmit = e => {
    console.log('click');
    handleSubmit(onSubmit)();
  };

  const onSubmit = data => {
    let payload = {
      ...data,
      ['photo']: photo == '' || photo == null ? 'N/A' : photo,
    };

    setLoading(true);

    createContact(payload)
      .then(resp => {
        setLoading(false);
        alert(resp.data.message);
        setShowModal(false);
      })
      .catch(error => {
        setLoading(false);
        alert(error.message);
        setShowModal(false);
      });
  };

  const onChange = e => {
    setPhoto(e);
  };

  const handleChoosePicture = () => {
    let options = {
      mediaType: 'photo',
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: 'image',
      },
    };

    launchImageLibrary(options, res => {
      if (res.didCancel) {
        console.log('User canceled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        setPhoto('data:image/jpeg;base64,' + res.assets[0].base64);
      }
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <SafeAreaView style={{height: height}}>
        <View style={styles.container}>
          {/* header */}
          <View style={styles.header}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Contact List</Text>
            <TouchableOpacity onPress={handleClickAdd}>
              <Text style={{fontSize: 15, fontWeight: 'bold', color: 'blue'}}>
                + Add
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            height="100%"
            data={listContact}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            scrollEnabled={true}
          />
        </View>
      </SafeAreaView>
      <GestureRecognizer
        style={{height: height}}
        onSwipeDown={() => setShowModal(false)}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModalAdd}
          onRequestClose={() => {
            setShowModal(!showModalAdd);
          }}>
          <View style={styles.containerModal}>
            <SafeAreaView>
              <View
                style={[
                  styles.header,
                  {
                    backgroundColor: 'white',
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                    marginTop: 20,
                  },
                ]}>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Text
                    style={{fontSize: 15, fontWeight: 'bold', color: 'blue'}}>
                    Back
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{fontSize: 15, fontWeight: 'bold', color: 'black'}}>
                  New Contact
                </Text>
                <TouchableOpacity onPress={handleClickSubmit}>
                  <Text
                    style={{fontSize: 15, fontWeight: 'bold', color: 'blue'}}>
                    Add
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  height: height,
                  backgroundColor: 'white',
                  padding: 16,
                }}>
                <View style={styles.field}>
                  <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <TextInput
                        autoCapitalize="words"
                        autoCompleteType="off"
                        autoCorrect={false}
                        maxLength={32}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        defaultValue={''}
                        placeholder={'First Name'}
                        style={styles.textContainer}
                      />
                    )}
                    name={'firstName'}
                    rules={{
                      required: {
                        value: true,
                        message: 'First name cannot be empty.',
                      },
                    }}
                    defaultValue={''}
                  />
                  {errors.firstName && (
                    <Text style={styles.error}>{errors.firstName.message}</Text>
                  )}
                  <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <TextInput
                        autoCapitalize="words"
                        autoCompleteType="off"
                        autoCorrect={false}
                        maxLength={32}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        defaultValue={''}
                        placeholder={'Last Name'}
                        style={styles.textContainer}
                      />
                    )}
                    name={'lastName'}
                    rules={{
                      required: {
                        value: true,
                        message: 'Last name cannot be empty.',
                      },
                    }}
                    defaultValue={''}
                  />
                  {errors.lastName && (
                    <Text style={styles.error}>{errors.lastName.message}</Text>
                  )}
                  <Controller
                    control={control}
                    render={({field: {onChange, onBlur, value}}) => (
                      <TextInput
                        autoCapitalize="words"
                        autoCompleteType="off"
                        autoCorrect={false}
                        maxLength={32}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                        defaultValue={''}
                        placeholder={'Age'}
                        style={styles.textContainer}
                        elipsis
                      />
                    )}
                    name={'age'}
                    rules={{
                      required: {
                        value: true,
                        message: 'Age cannot be empty.',
                      },
                    }}
                    defaultValue={''}
                  />
                  {errors.age && (
                    <Text style={styles.error}>{errors.age.message}</Text>
                  )}
                  <TextInput
                    autoCapitalize="words"
                    autoCompleteType="off"
                    autoCorrect={false}
                    onChangeText={(e) => setPhoto(e)}
                    value={photo.length >= 40 ? photo.substr(0, 40) + '...' : photo}
                    defaultValue={''}
                    placeholder={'Photo'}
                    style={{
                      paddingBottom: 10,
                      paddingTop: 10,
                    }}
                    id={'id'}
                    style={styles.textContainer}
                  />
                  <TouchableOpacity
                    style={{
                      borderRadius: 5,
                      borderColor: '#cdcdcd',
                      borderWidth: 1,
                      width: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 5,
                    }}
                    onPress={handleChoosePicture}>
                    <Text>Upload Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      </GestureRecognizer>

      <Modal
        transparent={true}
        animationType={'none'}
        visible={isLoading}
        style={{zIndex: 1100}}
        onRequestClose={() => {}}>
        <View
          style={[
            styles.containerModal,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <ActivityIndicator />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default Home;

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
    width: width,
  },
  content: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  header: {
    width: width,
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    borderColor: '#aeaeae',
    padding: 16,
  },
  avatar: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#aeaeae',
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginLeft: 10,
  },
  containerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  field: {
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    width: '100%',
    borderColor: '#cdcdcd',
    borderRadius: 5,
    borderWidth: 1,
  },
  textContainer: {
    paddingBottom: 10,
    paddingTop: 10,
    borderColor: '#cdcdcd',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  error: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#E5322E',
    marginTop: 5,
    textAlign: 'right',
  },
});
