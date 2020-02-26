$(function(){
$.ajax({
        url: 'refresh.php',
        method: 'GET',
        success: function(data){
          getProfiles(data.token);
        },
        error: function (data) {
            alert('error')
        }
    });
});
$('.force').click(function () {
    let token = $('#token').val();
    let val = $(this).val();
    if(token){
        setForced($('#profile').val(),val,token)
    } else {
        alert('Token requis !')
    }
});

$('.horaire').click(function () {
    let token = $('#token').val();
    let val = $(this).val();
    if(token){
        $('#profile option').each(function () {
            console.log($(this).val());
            setForced($(this).val(),val,token)
        })
    } else {
        alert('Token requis !')
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
                let link = data._embedded.ACDProfile[i]._links.self.href;
                $('#profile').append(`<option value="${link}" selected>Profile ${data._embedded.ACDProfile[i].identifier}</option>`)
            }
        },
        error: function (data) {
            alert('error')
        }
    });
}