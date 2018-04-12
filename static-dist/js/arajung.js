(function($) {

String.prototype.format = function() {
  var formatted = this
  for (var i = 0; i < arguments.length; i++) {
      var regexp = new RegExp('\\{'+i+'\\}', 'gi')
      formatted = formatted.replace(regexp, arguments[i])
  }
  return formatted;
}

// creating class for HTML strings to apply HTML injection with AJAX
HTMLString = function() {

  this.registerModal = `
  <div class="ui icon header">
    <i class="address book outline icon"></i>
    회원가입
  </div>
  <div class="content">
    <form class="ui form">
      <div class="field">
        <label style="color: white;">이메일</label>
        <input id="register-email-input" type="text" name="email" placeholder="username@email.com">
      </div>
      <div class="field">
        <label style="color: white;">이름</label>
        <input id="register-name-input" type="text" name="name" placeholder="본인이름">
      </div>
      <div class="field">
        <label style="color: white;">비밀번호</label>
        <input id="register-pw-input" type="password" name="password" placeholder="********">
      </div>
      <div class="field">
        <label style="color: white;">비밀번호 재입력</label>
        <input id="register-repw-input" type="password" name="password" placeholder="********">
      </div>
    </form>
  </div>
  <div class="ui center aligned grid" style="margin: 1%;">
    <div id="show-pw-error" style="color: red;"></div>
  </div>
  <div class="actions">
    <div class="ui red basic cancel inverted button">
      <i class="remove icon"></i>
      취소
    </div>
    <div class="ui green ok inverted button">
      <i class="checkmark icon"></i>
      회원가입
    </div>
  </div>
  `

  this.loginModal = `
  <div class="ui icon header">
    <i class="archive icon"></i>
    로그인
  </div>
  <div class="content">
    <form class="ui form">
      <div class="field">
        <label style="color: white;">아이디</label>
        <input id="login-email-input" type="text" name="username" placeholder="username@email.com">
      </div>
      <div class="field">
        <label style="color: white;">비밀번호</label>
        <input id="login-pw-input" type="password" name="password" placeholder="********">
      </div>
    </form>
  </div>
  <div class="ui center aligned grid" style="margin: 1%;">
    <div id="show-pw-error" style="color: red;"></div>
  </div>
  <div class="actions">
    <div class="ui red basic cancel inverted button">
      <i class="remove icon"></i>
      취소
    </div>
    <div class="ui green ok inverted button">
      <i class="checkmark icon"></i>
      로그인
    </div>
  </div>
  `
}

// creating class to call AJAX function and keep track of states within the website
AjaxFunctions = function() {
  this.username = ''
}

AjaxFunctions.prototype.registerUser = function(username, name, password) {
  $.ajax({
    method: "POST",
    url: '/user-api/user/',
    data: {
        'username': username,
        'last_name': name,
        'password': password
    },
    success: function(data){
      // pass
    },
    error: function(data){
      console.log(data.status)
    }
  })
}

AjaxFunctions.prototype.loginUser = function(username, password) {
  $.ajax({
    method: "POST",
    url: '/login/',
    data: {
        'username': username,
        'password': password
    },
    success: function(data){
      location.href = '/'
    },
    error: function(data){
      console.log(data.status)
    }
  })
}

// creating class to manipulate HTML code on website
DataManipulator = function() {
  // empty attributes
}

DataManipulator.prototype.getRegisterInfo = function(registerUserFunc) {
  var email = $('#register-email-input').val()
  var name = $('#register-name-input').val()
  var password = $('#register-pw-input').val()
  var repassword = $('#register-repw-input').val()
  if (password != repassword) {
    $('#show-pw-error').html('재입력하신 비밀번호가 일치하지 않습니다. 한 번만 더 확인해주세요.')
    return 'no pass'
  } else if (password == repassword) {
    registerUserFunc(email, name, password)
  }
}

DataManipulator.prototype.getLoginInfo = function(loginUserFunc) {
  var email = $('#login-email-input').val()
  var password = $('#login-pw-input').val()
  loginUserFunc(email, password)
}


var html = new HTMLString()
var ajax = new AjaxFunctions()
var data = new DataManipulator()

function registerUser() {
  var status = data.getRegisterInfo(ajax.registerUser)

  if (status == 'no pass') {
    return false
  } else {
    return true
  }
}

function loginUser() {
  data.getLoginInfo(ajax.loginUser)
}

// Modal Definition
$(document).on('click', '#register-btn', function () {
  $('#modal-section').html(html.registerModal)
  $('#modal-section').modal({
    closable  : function() {
      return true
    },
    onDeny    : function() {
      return true
    },
    onApprove : function() {
      var status = registerUser()
      return status
    }
  }).modal('show')
})

$(document).on('keydown', '#register-repw-input', function(e) {
    if (e.keyCode == 13) {
      registerUser()
    }
})

$(document).on('click', '#login-btn', function () {
  $('#modal-section').html(html.loginModal)
  $('#modal-section').modal({
    closable  : function() {
      return true
    },
    onDeny    : function() {
      return true
    },
    onApprove : function() {
      var status = loginUser()
      return status
    }
  }).modal('show')
})

$(document).on('keydown', '#login-pw-input', function(e) {
    if (e.keyCode == 13) {
      loginUser()
    }
})

$(document).on('click', '#logout-btn', function () {
  location.href = '/logout'
})

})(jQuery);
