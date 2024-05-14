function logout() {
    $.ajax({
        type: "POST",
        url: "/sign/logout",
        contentType: 'application/json',
        success: function(data) {
            window.location.href = '/';
        }
    })
}