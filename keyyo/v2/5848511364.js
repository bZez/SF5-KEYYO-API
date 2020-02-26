$(function(){
$.ajax({
        url: '../refresh.php',
        method: 'GET',
        success: function(data){
        window.localStorage.setItem('token',data.token);
          getProfiles(data.token);
        },
        error: function (data) {
            alert('error')
        }
    });
});

$('#profile').change(function(){
    let profile = $(this).val();
    if(profile !== 'all'){
    setForced(profile,1,window.localStorage.getItem('token'));
    } else {
    $("#profile option[name!='all']").each(function () {
            console.log($(this).val());
            setForced($(this).val(),0,window.localStorage.getItem('token'))
    })
    }
});
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
            alert('error')
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
                $('#profile').append(`<option value="${link}" ${selected} class="bg-${bg}">${profileName}</option>`).addClass('bg-success');
            }
            $('#profile').append(`<option value="all" class='bg-danger' name='all'>Horaire</option>`);
            if(countActive < 1){
            $("option[name='all']").attr('selected',true);
            }
        },
        error: function (data) {
            alert('error')
        }
    });
}