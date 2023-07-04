import React, { useContext, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import {
    Background,
    BackButton,
    Header,
    TextInput,
    Button,
    Logo,
    Paragraph,
} from '../../components/index';
import { useRoute } from "@react-navigation/native";
import { Text } from "react-native-paper";
import { AuthContext } from '../../context/AuthContext';
import Spinner from "react-native-loading-spinner-overlay/lib";
import { emailValidator } from '../../helpers/emailValidator';
import { nomeValidator } from '../../helpers/nomeValidator';
import { telefoneValidator } from '../../helpers/telefoneValidator';
import { theme } from "../../core/theme";

const ResetUserData = ({ navigation }) => {
    const { isLoading, userInfo, resetUserData, sendCodeForNewPhoneNumber } = useContext(AuthContext);
    const [name, setName] = useState({ value: userInfo?.user?.name, error: '' });
    const [telefone, setTelefone] = useState({ value: userInfo?.user?.telefone, error: '' });
    const [email, setEmail] = useState({ value: userInfo?.user?.email, error: '' });
    const [endereco, setEndereco] = useState({ value: userInfo?.user?.endereco, error: '' });
    
    const route = useRoute();
    const { validateCodeError } = (route.params) ? route.params : {...null};

    const onSavePressed = () => {
        const nameError = nomeValidator(name.value);
        const telefoneError = telefoneValidator(telefone.value);
        const emailError = emailValidator(email.value);
        if (nameError || telefoneError || emailError) {
            setName({ ...name, error: nameError })
            setTelefone({ ...telefone, error: telefoneError })
            setEmail({ ...email, error: emailError })
            return
        }

        resetData();
    }

    const resetData = async () => {

        if(telefone.value !== userInfo.user.telefone){// Se true, numero de telefone deve ser alterado

            let phoneRes = await sendCodeForNewPhoneNumber(telefone.value);

            if(phoneRes){ //Esta rota altera primeiro o numero de telefone e depois outros dados
                //Neste caso, a funcao resetUserData e chamada dentro da screen CodValidateScreen, na funcao validateChangeCode
                navigation.navigate('CodValidateScreen', { 
                    telefone: telefone.value,
                    name: name.value,
                    email: email.value,
                    endereco: endereco.value,
                });
            }

            if(validateCodeError){
                setTelefone({ value: userInfo?.user?.telefone, error: '' });
            }

        }else{//
            resetUserData(name.value, email.value, endereco.value);
        }

    }

    return (
        <Background>
            <Spinner visible={isLoading} />
            <BackButton goBack={navigation.goBack} />
            <Logo source={require('../../assets/logo_img/LOCALIZALOGO.png')} />
            <Header>PERFIL</Header>

            <View style={styles.row}>
                <Text style={styles.columnLeft}>Nome</Text>
                <View style={styles.columnRight} >
                    <TextInput
                        returnKeyType="next"
                        value={name.value}
                        onChangeText={text => setName({ value: text, error: '' })}
                        error={!!name.error}
                        errorText={name.error}
                    />
                </View>

            </View>

            <View style={styles.row}>
                <Text style={styles.columnLeft}>Telefone</Text>
                <View style={styles.columnRight}>
                    <TextInput
                        returnKeyType="next"
                        value={telefone.value}
                        onChangeText={(number) => setTelefone({ value: number, error: '' })}
                        error={!!telefone.error}
                        errorText={telefone.error}
                        autoCapitalize="none"
                        autoCompleteType="telefone"
                        textContentType="contact"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.columnLeft}>Email</Text>
                <View style={styles.columnRight}>
                    <TextInput
                        returnKeyType="next"
                        value={email.value}
                        onChangeText={(text) => setEmail({ value: text, error: '' })}
                        error={!!email.error}
                        errorText={email.error}
                        autoCapitalize="none"
                        autoCompleteType="email"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.columnLeft}>Endereço</Text>
                <View style={styles.columnRight}>
                    <TextInput
                        returnKeyType="done"
                        value={endereco.value}
                        onChangeText={(text) => setEndereco({ value: text, error: '' })}
                        error={!!endereco.error}
                        errorText={endereco.error}
                        autoCapitalize="words"
                    />
                </View>
            </View>

            <TouchableOpacity onPress={() => { navigation.jumpTo('ChangeUserPassword') }}>
                <Paragraph style={styles.setPass}>Clique aquí para alterar senha</Paragraph>
            </TouchableOpacity>

            <Button
                mode="contained"
                style={{ marginTop: 24 }}
                onPress={onSavePressed}
            >
                Salvar Alterações
            </Button>
        </Background>
    )
}

const styles = StyleSheet.create({
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    columnRight: {
        width: '70%'
    },
    columnLeft: {
        width: '30%',
        marginRight: 10,
        fontWeight: 'bold',
    },
    setPass: {
        fontSize: 16,
        color: theme.colors.secondary,
        paddingTop: 10,
    },
})

export default ResetUserData;