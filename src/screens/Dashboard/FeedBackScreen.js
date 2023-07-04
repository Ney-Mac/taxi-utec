import React, { useContext, useState } from 'react';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SegmentedButtons } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { showMessage } from 'react-native-flash-message';
import { BASE_URL } from '../../config';
import { theme } from '../../core/theme';
import {
    Background,
    BackButton,
    TextInput,
    Button,
    Logo,
    Header
} from '../../components/index';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import axios from 'axios';

const FeedBackScreen = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);
    const [message, setMessage] = useState({ value: '', error: '' });
    const [typeMessage, setTypeMessage] = useState('sugestao');
    const [isLoading, setIsLoading] = useState(false);

    const onSendPressed = async () => {
        setIsLoading(true);

        try {
            const res = await axios({
                url: `${BASE_URL}novo-feedback`,
                method: 'post',
                headers: {
                    Authorization: `Bearer ${userInfo.accessToken}`,
                },
                data: {
                    type: typeMessage,
                    detalhe: message.value,
                }
            });

            console.log(res.data);
            setMessage({ value: '', error: '' });

            showMessage({
                message: 'Feedback',
                description: res.data.message,
                type: 'success',
                duration: 4000,
                statusBarHeight: getStatusBarHeight(),
            })

            setIsLoading(false);
        } catch (e) {
            console.log(`feedback error ${e} -> ${e.response?.data?.message}`);

            showMessage({
                message: 'Enviar Feedback',
                description: e.response ? e.response.data.message : 'Está sem conexão a internet',
                type: 'danger',
                duration: 4000,
                statusBarHeight: getStatusBarHeight(),
            });

            setIsLoading(false);
        }
    }

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Spinner visible={isLoading} />
            <Logo source={require('../../assets/logo_img/LOCALIZALOGO.png')} />
            <Header>Enviar Feedback</Header>

            <SegmentedButtons
                value={typeMessage}
                onValueChange={setTypeMessage}
                style={{ width: '100%', marginVertical: 15 }}
                buttons={[
                    {
                        value: 'sugestao',
                        label: 'Sugerir',
                        showSelectedCheck: true,
                        style: {
                            backgroundColor: typeMessage === 'sugestao' ? theme.colors.primary : theme.colors.surface,
                            width: '50%',
                            paddingVertical: 4,
                            borderColor: theme.colors.primary,
                        },
                    },
                    {
                        value: 'reclamacao',
                        label: 'Reclamar',
                        showSelectedCheck: true,
                        style: {
                            backgroundColor: (typeMessage === 'reclamacao') ? theme.colors.primary : theme.colors.surface,
                            width: '50%',
                            paddingVertical: 4,
                            borderColor: theme.colors.primary,
                        },
                    },
                ]}
            />

            <TextInput
                label="Deixe sua mensagem"
                returnKeyType="done"
                value={message.value}
                onChangeText={text => setMessage({ value: text, error: '' })}
                error={!!message.error}
                errorText={message.error}
                multiline={true}
                style={{ height: 150 }}
            />

            <Button
                mode="contained"
                style={{ marginTop: 24 }}
                onPress={onSendPressed}
            >
                Enviar
            </Button>
        </Background>
    )
}

export default FeedBackScreen;
