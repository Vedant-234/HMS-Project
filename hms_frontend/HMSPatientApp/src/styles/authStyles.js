import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1fefe',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  logo: {
    width: 280,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
    justifyContent:'center',
    borderRadius:200,

  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A7C7C',
    marginVertical: 10
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#cceeee'
  },
  button: {
    width: '100%',
    backgroundColor: '#0A7C7C',
    padding: 15,
    borderRadius: 8,
    marginTop: 15
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  passwordBox: {
  flexDirection: "row",
  alignItems: "center",
},

eye: {
  fontSize: 20,
  marginLeft: 10,
},

  link: {
    color: '#0A7C7C',
    marginTop: 15
  }
});
