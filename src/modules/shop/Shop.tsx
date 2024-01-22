import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions
} from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp  } from '@react-navigation/stack'
import { request } from "../../utils/request"
import Loading from "../../components/widget/Loading"

import icon_search from '../../assets/icon_search.png';
import icon_shop_car from '../../assets/icon_shop_car.png';
import icon_orders from '../../assets/icon_orders.png';
import icon_menu_more from '../../assets/icon_menu_more.png';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH - 18 >> 1;

export default () => {
    const navigation = useNavigation<StackNavigationProp<any>>()
    const SIZE = 10
    const [page,setPage] = useState<number>(1)
    const [goodsList,setGoodsList] = useState<GoodsSimple[]>([])
    const [refreshing,setRefreshing] = useState<boolean>(false)
    const [categoryList,setCategoryList] = useState<GoodsCategory[]>([])

    const requestGoodsList = useCallback(async () => {
        if (refreshing) {
            return;
        }
        Loading.show();
        try {
            setRefreshing(true);
            const params = {
                page: page,
                size: SIZE,
            };
            const { data } = await request('goodsList', params);
            if (data?.length) {
                if (page === 1) {
                    setGoodsList(() => data);
                } else {
                    setGoodsList((preData) => [...preData,data])
                }
                setPage((preData) => preData + 1)
            } else {
                if (page === 1) {
                    setGoodsList([])
                } else {
                    // 已经加载完了，没有更多数据
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setRefreshing(false)
            Loading.hide();
        }
    },[])

    const requestTop10Category = useCallback(async () => {
        try {
            const { data } = await request('top10Category', {});
            setCategoryList(() => data || [])
        } catch (error) {
            console.log(error);
        }        
    },[])

    useEffect(() => {
        requestGoodsList()
        requestTop10Category
    },[])
    
    const onSearchPress = useCallback(() => {
        navigation.push('SearchGoods')
    },[])

    const renderTitle = () => {
        return (
            <View style={styles.titleLayout}>
                <TouchableOpacity
                    style={styles.searchLayout}
                    onPress={onSearchPress}
                >
                    <Image style={styles.searchIcon} source={icon_search}/>
                    <Text style={styles.searchTxt}>请输入搜索商品</Text>
                </TouchableOpacity>
                <Image style={styles.menuIcon} source={icon_shop_car} />
                <Image style={styles.menuIcon} source={icon_orders} />
                <Image style={styles.menuIcon} source={icon_menu_more} />                
            </View>
        )
    }

    const renderItem = ({item, index}: {item: GoodsSimple, index: number}) => {
        const styles = StyleSheet.create({
            item: {
                width: ITEM_WIDTH,
                borderRadius: 8,
                overflow: 'hidden',
                marginLeft: 6,
                marginTop: 6,
            },
            img: {
                width: '100%',
                height: 200,
                resizeMode: 'cover',
            },
            titleTxt: {
                fontSize: 14,
                color: '#333',
                marginTop: 6,
            },
            prefix: {
                fontSize: 14,
                color: '#333',
                fontWeight: 'bold',
                marginTop: 4,
            },
            priceTxt: {
                fontSize: 22,
                color: '#333',
                fontWeight: 'bold',
                textAlign: 'justify',
            },
            originTxt: {
                fontSize: 13,
                color: '#999',
                fontWeight: 'normal',
            },
            promotionTxt: {
                width: 78,
                fontSize: 12,
                color: '#999',
                borderRadius: 2,
                borderWidth: 1,
                borderColor: '#bbb',
                textAlign: 'center',
                marginTop: 4,
            },
        });
        return (
            <View style={styles.item}>
                <Image style={styles.img} source={{uri: item.image}} />
                <Text style={styles.titleTxt}>{item.title}</Text>
                {!!item.promotion &&
                <Text style={styles.promotionTxt}>{item.promotion}</Text>
                }
                <Text style={styles.prefix}>
                    ¥
                    <Text style={styles.priceTxt}>{item.price}   {!!item.originPrice && <Text style={styles.originTxt}>原价：{item.originPrice}</Text>}</Text>
                </Text>
            </View>
        );
    }

    const ListHeader = () => {
        const styles = StyleSheet.create({
            container: {
                width: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap',
            },
            categoryItem: {
                width: '20%',
                alignItems: 'center',
                paddingVertical: 16,
            },
            itemImg: {
                width: 40,
                height: 40,
                resizeMode: 'contain',
            },
            itemNameTxt: {
                fontSize: 14,
                color: '#333',
                marginTop: 6,
            },
        })
        return (
            <View style={styles.container}>
                {categoryList.map((item, index) => {
                    return (
                        <View key={`${item.id}`} style={styles.categoryItem}>
                            <Image
                                style={styles.itemImg}
                                source={{ uri: item.image }}
                            />
                            <Text style={styles.itemNameTxt}>{item.name}</Text>
                        </View>
                    );
                })}
            </View>
        );
    }

    return (
        <View style={styles.root}>
            {renderTitle()}
            <FlatList
                style={{ flex:1 }}
                data={goodsList}
                keyExtractor= { (item) => `${item.id}`}
                extraData={categoryList} 
                renderItem={renderItem} 
                numColumns={2}
                ListHeaderComponent={<ListHeader />}  
            />
        </View>
    )
}

const styles = StyleSheet.create({
    root:{
        width:'100%',
        height:'100%',
        backgroundColor:'white'
    },
    titleLayout:{
        width:'100%',
        height:40,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:16
    },
    searchLayout:{
        height:32,
        flex:1,
        backgroundColor:'#f0f0f0',
        borderRadius:16,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:16
    },
    searchIcon: {
        width: 18,
        height: 18,
    },
    searchTxt: {
        fontSize: 14,
        color: '#bbb',
        marginLeft: 6,
    },
    menuIcon: {
        width: 22,
        height: 22,
        marginHorizontal: 6,
    },    
}) 
