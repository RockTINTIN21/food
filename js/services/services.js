const postData = async (url,data) =>{ //async показывает что функция будет асинхронной
    let res = await fetch(url,{ //await будет ждать пока операция выполнится прежде чем пойти дальше, не работает без async. Тоесть без await код продолжит работать даже если в перменную еще ничего не пришло, тк запрос может идти долго
        method:"POST",
        header:{
            'Content-type':'application/json'
        },
        body: data
    });
    return await res.json();
};

export {postData};