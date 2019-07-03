//为了和QQ音乐接口一致，配置一些公用的参数、options和err_num码

export const options={
    param: 'jsonpCallback'
}


export const commonParams={
    g_tk: 5381,
    inCharset:' utf-8',
    outCharset:' utf-8',
    format: 'jsonp'
}

export const ERR_OK =0