import apiFetch from "@wordpress/api-fetch";

export const AjaxSearch = (text:string,limit:Number,offset:Number) => {
    let formData = new FormData();
    formData.append('keyword', text);
    return apiFetch( {
        path: '/plugin-slug/find/',
        method: 'POST',
        data: {
            keyword: text,
            limit,
            offset },
    } );
}
