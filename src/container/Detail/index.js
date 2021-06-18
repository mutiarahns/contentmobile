import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import IconPerson from '../../assets/ic_person.png';
import {deleteContact, updateContact, getContactById} from '../../api';
import GestureRecognizer from 'react-native-swipe-gestures';
import {Controller, useForm} from 'react-hook-form';
import {launchImageLibrary} from 'react-native-image-picker';

const DetailPage = ({navigation, route}) => {
  const data = route.params;
  var imgSource = data.photo == 'N/A' ? IconPerson : {uri: data.photo};
  const [showModalAdd, setShowModal] = React.useState(false);
  const [photo, setPhoto] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [editData, setEditData] = React.useState({...data});
  const [refresh, setRefresh] = React.useState(0);

  React.useEffect(() => {
    getContact(data.id);
  }, [refresh]);

  const getContact = (id) => {
    getContactById(id).then(resp => {

      imgSource = resp.data.data.photo == 'N/A' ? IconPerson : {uri: resp.data.data.photo};
      setEditData[resp.data.data];
    }).then(err => setLoading(false));
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
  } = useForm();

  const handleClickEdit = id => {
    console.log('handle click edit');
    reset();
    setEditData({...data});
    setShowModal(true);
    setPhoto(data.photo);

    setValue('firstName', editData.firstName);
    setValue('lastName', editData.lastName);
    setValue('age', editData.age);
  };

  const handleClickBack = () => {
    navigation.goBack();
  };

  const handleDeleteContact = id => {
    console.log(id);
    Alert.alert('Are you sure?', 'This action cannot be undone.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          setLoading(true);
          deleteContact(id)
            .then(resp => {
              setLoading(false);
              alert(resp.data.message);
              navigation.goBack();
            })
            .catch(error => {
              setLoading(false);
              alert(error.message);
              navigation.goBack();
            });
          console.log('Delete Pressed');
        },
      },
    ]);
  };

  const handleClickSubmit = e => {
    console.log('click');
    handleSubmit(onSubmit)();
  };

  const onChange = e => {
    console.log(e);
    setPhoto(e);
  };

  const onSubmit = data => {
    console.log('DATA ===== ', {...data, photo});

    setLoading(true);
    updateContact(route.params.id, {...data, ["photo"]: photo == '' || photo == null ? 'N/A' : photo})
      .then(resp => {
        setLoading(false);
        setRefresh(refresh+1);
        alert(resp.data.message);
        setShowModal(false);
      })
      .catch(error => {
        setLoading(false);
        alert(error.message);
        setShowModal(false);
      });
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
            <TouchableOpacity onPress={handleClickBack}>
              <Text style={{fontSize: 15, fontWeight: '500', color: 'blue'}}>
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleClickEdit(data.id);
              }}>
              <Text style={{fontSize: 15, fontWeight: '500', color: 'blue'}}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.imagebg}>
            <Image source={imgSource} style={styles.avatar} />
            <Text
              style={styles.name}>{`${data.firstName} ${data.lastName}`}</Text>
          </View>
          <ScrollView style={styles.content}>
            <View style={styles.field}>
              <View style={styles.textContainer}>
                <Text>First name</Text>
                <TextInput
                  id={'firstName'}
                  editable={true}
                  style={{marginTop: 5, marginBottom: 5, color: 'blue'}}
                  editable={false}
                  value={editData.firstName}
                />
              </View>
              <View style={styles.textContainer}>
                <Text>Last name</Text>
                <TextInput
                  id={'lastName'}
                  editable={true}
                  style={{marginTop: 5, marginBottom: 5, color: 'blue'}}
                  editable={false}
                  value={editData.lastName}
                />
              </View>
              <View style={styles.textContainer}>
                <Text>Age</Text>
                <TextInput
                  id={'age'}
                  editable={true}
                  style={{marginTop: 5, marginBottom: 5, color: 'blue'}}
                  editable={false}
                  value={String(editData.age)}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.field, {marginTop: 15, marginBottom: 15}]}
              opacity={0.2}
              onPress={() => handleDeleteContact(data.id)}>
              <Text style={{color: 'red'}}>Delete</Text>
            </TouchableOpacity>
          </ScrollView>
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
                    Edit
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
                  <View style={{marginBottom: 10}}>
                    <Text>First name</Text>
                    <Controller
                      control={control}
                      render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                          autoCapitalize="words"
                          autoCompleteType="off"
                          autoCorrect={false}
                          maxLength={32}
                          onBlur={onBlur}
                          onChangeText={value => {
                            setEditData({...editData, firstName: value});
                            onChange(value);
                          }}
                          value={editData.firstName}
                          defaultValue={''}
                          placeholder={'First Name'}
                          style={[styles.textContainer, {color: 'blue'}]}
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
                      <Text style={styles.error}>
                        {errors.firstName.message}
                      </Text>
                    )}
                  </View>
                  <View style={{marginBottom: 10}}>
                    <Text>Last name</Text>
                    <Controller
                      control={control}
                      render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                          autoCapitalize="words"
                          autoCompleteType="off"
                          autoCorrect={false}
                          maxLength={32}
                          onBlur={onBlur}
                          onChangeText={value => {
                            setEditData({...editData, lastName: value});
                            onChange(value);
                          }}
                          value={editData.lastName}
                          defaultValue={''}
                          placeholder={'Last Name'}
                          style={[styles.textContainer, , {color: 'blue'}]}
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
                      <Text style={styles.error}>
                        {errors.lastName.message}
                      </Text>
                    )}
                  </View>

                  <View style={{marginBottom: 10}}>
                    <Text>Age</Text>
                    <Controller
                      control={control}
                      render={({field: {onChange, onBlur, value}}) => (
                        <TextInput
                          autoCapitalize="words"
                          autoCompleteType="off"
                          autoCorrect={false}
                          maxLength={32}
                          onBlur={onBlur}
                          onChangeText={value => {
                            setEditData({...editData, age: value});
                            onChange(value);
                          }}
                          value={String(editData.age)}
                          defaultValue={''}
                          placeholder={'Age'}
                          style={[styles.textContainer, , {color: 'blue'}]}
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
                  </View>

                  <View style={styles.textContainer}>
                    <Text>Photo</Text>
                    <TextInput
                      id={'photo'}
                      editable={true}
                      style={{marginTop: 5, marginBottom: 5, color: 'blue'}}
                      editable={true}
                      value={photo.length >= 40 ? photo.substr(0, 40)+"..." : photo}
                      onChangeText={(value) => setPhoto(value)}
                    />
                  </View>


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

export default DetailPage;

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
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'white',
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginLeft: 10,
  },
  imagebg: {
    width: width,
    padding: 16,
    backgroundColor: '#aeaeae',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 10,
    marginBottom: 10,
    borderColor: '#cdcdcd',
    borderBottomWidth: 1,
  },
  containerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  error: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#E5322E',
    marginTop: 5,
    textAlign: 'right',
  },
});
