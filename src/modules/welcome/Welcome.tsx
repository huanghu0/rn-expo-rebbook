import React, { useEffect } from "react";
import {
    View,
    Image,
    StyleSheet
} from "react-native"

import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from '@react-navigation/stack'

import { load } from "../../stores/Storage";

import UserStore from "../../stores/UserStore";

import icon_main_logo from '../../assets/icon_main_logo.png'

export default () => {

    const navigation = useNavigation<StackNavigationProp<any>>();

    useEffect(() => {
        setTimeout(() => {
            getUserInfo();
        },3000)
    },[])

    const startLogin = () => {
        navigation.replace('Login') // 跳到登录页
    }

    const startHome = () => {
        navigation.replace('MainTab')
    }

    const getUserInfo = async () => {
        const cacheUserInfo = await load('userInfo');
        if (!cacheUserInfo) {
            startLogin();
        } else {
            const parse = JSON.parse(cacheUserInfo);
            if (parse) {
                UserStore.setUserInfo(parse);
                startHome();
            } else {
                startLogin();
            }
        }
    }

    return (
        <View style={ styles.root }>
            <Image style={styles.logo_mian} source={icon_main_logo}></Image>
        </View>    
    )
}

const styles = StyleSheet.create({
    root:{
        width:'100%',
        height:'100%',
        backgroundColor:'white',
        flexDirection:'column',
        alignItems:'center'
    },
    logo_mian:{
        width:200,
        height:105,
        marginTop:200,
        resizeMode:'contain'
    }
})