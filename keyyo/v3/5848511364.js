$(function(){
$.ajax({
        url: '../refresh.php',
        method: 'GET',
        success: function(data){
        window.localStorage.setItem('token',data.token);
          getProfiles(data.token);
        },
        error: function (data) {
            alert('Rafraichissez la page pour regenerer un token.')
        }
    });
});

function clicked(that){
    $("#profile button.btn-success").toggleClass('btn-danger btn-success');
    that.toggleClass('btn-danger btn-success');
    let profile = that.val();
    if(profile !== 'all'){
    setForced(profile,1,window.localStorage.getItem('token'));
    } else {
    $("#profile button[name!='all']").each(function () {
            console.log($(this).val());
            setForced($(this).val(),0,window.localStorage.getItem('token'))
    })
    }
};

function setForced(profile,val,token){
    $.ajax({
        url: `${profile}`,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        method: 'POST',
        data: {forced:val},
        success: function(data){
            $('#result').html('Statut du forced: '+ data.forced)
        },
        error: function (data) {
            alert('Rafraichissez la page pour regenerer un token.')
        }
    });
}

function getProfiles(token) {
    $.ajax({
        url: `https://api.keyyo.com/manager/1.0/services/33980089880/profiles`,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        method: 'GET',
        success: function(data){
            for(i=0;i<data._embedded.ACDProfile.length;i++){
            countActive = 0;
                let link = data._embedded.ACDProfile[i]._links.self.href;
                let profileName = data._embedded.ACDProfile[i].name;
                if(profileName == ''){profileName='Default'};
                if(data._embedded.ACDProfile[i].forced === 1){
                countActive++;
                selected = "selected";
                bg = 'success';
                } else {
                selected = '';
                bg ='danger';
                }
                $('#profile').append(`<button value="${link}" ${selected} class="col-12 mb-3 btn btn-${bg}" onclick="clicked($(this))">${profileName}</button>`);
            }
            if(countActive < 1){
              $('#profile').append(`<button value="all" class='col-12 btn btn-success' name='all' onclick="clicked($(this))">Horaire</button>`);
            } else {
               $('#profile').append(`<button value="all" class='col btn btn-danger' name='all' onclick="clicked($(this))">Horaire</button>`);
            }
        },
        error: function (data) {
            alert('Rafraichissez la page pour regenerer un token.')
        }
    });
}