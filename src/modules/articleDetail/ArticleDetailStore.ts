import { observable } from 'mobx'
import { request } from '../../utils/request'
import Loading from '../../components/widget/Loading'

export default class ArticleDetailStore {
    @observable detail:Article = {} as Article;

    requestArticleDetail = async (id:number) => {
        Loading.show()
        try {
            const params = {
                id,
            }
            const { data } = await request('articleDetail', params);
            // console.log(data,'data-------------------')
            this.detail = data || {};
        }catch(error){
            console.log(error)
        }finally{
            Loading.hide()
        }
    }
}