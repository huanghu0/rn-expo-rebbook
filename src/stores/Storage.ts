import AsyncStorage from "@react-native-async-storage/async-storage";

export const save = async (key: string,value: string) => {
    try{
        return await AsyncStorage.setItem(key,value)
    }catch(error){
        console.error(error)
    }
}

export const load = async (key:string) => {
    try {
        return await AsyncStorage.getItem(key)
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const remove = async (key:string) => {
    try {
        return await AsyncStorage.removeItem(key)
    } catch (error) {
        console.error(error)
    }
}

export const clear = async () => {
    try {
        return await AsyncStorage.clear()
    } catch (error) {
        console.error(error)
    }
}