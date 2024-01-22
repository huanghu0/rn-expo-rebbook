import React,{ useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native'

import { useLocalStore,observer,useLocalObservable } from "mobx-react";
import { request } from "../../utils/request";
import HomeStore from "./HomeStore";
import FlowList from "../../components/flowlist/FlowList";
import ResizeImage from "../../components/ResizeImage";
import Heart from "../../components/Heart";
import TitleBar from './components/TitleBar';
import CategotyList from "./components/CategotyList";

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';


const { width:SCREEN_WIDTH } = Dimensions.get('window')

const SIZE = 10;

export default observer(() => {
    const store = useLocalObservable(() => new HomeStore())
    const [data,setData] = useState<ArticleSimple[]>([]) // 页面数据
    const [refresh,setRefresh] = useState<boolean>(false) // 加载
    const [page,setPage] =  useState<number>(1) // 页面page
    const navigation = useNavigation<StackNavigationProp<any>>();

    const requestHomeList = useCallback(async () => {
        if(refresh){
            return
        }

        try {
            setRefresh(true)
            const params = {
                page,
                size:SIZE
            }
            const { data } = await request('homeList',params)
            if(data?.length){
                if(page === 1){
                    setData(preData =>  data) 
                }else{
                    setData(preData => [...preData,...data])
                }
                setPage(prePage => prePage + 1)
            }else{
                if(page === 1){
                    setData([])
                }else{
                    // do nothing
                }
            }
            // this.homeList = data;
            // this.refreshing = false
        }catch(err){
            console.log(err);
        }finally{
            setRefresh(false)
        }
    },[]) 

    const resetPage = useCallback(() => {
        setPage(1)
    },[])

    useEffect(() => {
        requestHomeList();
        store.getCategoryList();
    },[])   
    

    

    const refreshNewData = useCallback(() => {
        resetPage();
        requestHomeList()
    },[])

    const loadMoreData = useCallback(() => {
        requestHomeList();
    },[])

    const onArticlePress = useCallback((article:ArticleSimple) => () => {
        navigation.push('ArticleDetail', {id: article.id})
    },[])

    const renderItem = ({item,index}:{item:ArticleSimple,index:number}) => {
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={onArticlePress(item)}   
            >               
                <ResizeImage uri={item.image} />
                <Text style={styles.titleTxt}>{ item.title }</Text>
                <View style={ styles.nameLayout }>
                    <Image style={styles.avatarImg} source={{ uri:item.avatarUrl }} />
                    <Text style={ styles.nameTxt }>{ item.userName }</Text>
                    <Heart
                        value={item.isFavorite}
                        onValueChanged={(value: boolean) => {
                            console.log(value);
                        }}
                    />
                    <Text style={styles.countTxt}>{ item.favoriteCount }</Text>
                </View>
            </TouchableOpacity>

        )
    }

    const Footer = () => {  
        return (
            <Text style={styles.footerTxt }>没有更多数据</Text>
        )
    }
 
    const categoryList = store.categoryList.filter(i => i.isAdd);

    return (
        <View style={styles.root}>
            <TitleBar
                tab={1}
                onTabChanged={(tab: number) => {
                    console.log(`tab=${tab}`)
                }}
            />            
            <FlowList
                style={styles.flatList} 
                data={data}
                keyExtrator={(item: ArticleSimple) => `${item.id}`}
                contentContainerStyle={styles.container}
                renderItem={renderItem}
                numColumns={2} 
                refreshing={ refresh }
                onRefresh={refreshNewData} 
                extraData={[refresh]} 
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.1}
                ListFooterComponent={Footer} 
                ListHeaderComponent={
                    <CategotyList
                        categoryList={categoryList}
                        allCategoryList={store.categoryList}
                        onCategoryChange={(category:Category) => {
                            console.log(JSON.stringify(category))
                        }}
                    ></CategotyList>
                }
            >
            </FlowList> 
        </View>
    )
}) 

const styles = StyleSheet.create({
    root:{
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#f0f0f0'
    },
    flatList:{
        width:'100%',
        height:'100%'
    },
    container:{
        paddingTop:6,
    },
    item:{
        width: SCREEN_WIDTH - 18 >> 1,
        backgroundColor:'white',
        marginLeft:6,
        marginBottom:6,
        borderRadius:8,
        overflow:"hidden"
    },
    itemImage:{
        width:'100%',
        height:250,
        resizeMode:'cover'
    },
    titleTxt:{
        fontSize:14,
        color:'#333',
        marginHorizontal:10,
        marginVertical:4, 
    },
    nameLayout:{
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:10,
        marginBottom:10
    },
    avatarImg:{
        width:20,
        height:20,
        resizeMode:'cover',
        borderRadius:10,
    },
    nameTxt:{
        fontSize:12,
        color:'#999',
        marginLeft:6,
        flex:1,
    },
    heart:{
        width:20,
        height:20,
        resizeMode:'contain'
    },
    countTxt:{
        fontSize:14,
        color:'#999',
        marginLeft:4
    },
    footerTxt:{
        width:'100%',
        fontSize:14,
        color:'#999',
        marginVertical:16,
        textAlign:'center',
        textAlignVertical:'center'
    }
}) 
