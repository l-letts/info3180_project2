/* Add your Application JavaScript */
/* global Vue */
/* global localStorage */
/* global fetch */
/* global token */
/* global $ */
/* global VueRouter */

Vue.component('app-header', {
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <img id="logo" src='static/images/logo.png' class="small-logo"/>
      <a class="navbar-brand" href="#">Photogram</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
        </ul>
      </div>
      
        <ul class="navbar-nav">
            <li class="nav-item active">
                <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item active">
              <router-link class="nav-link" to="/explore">Explore</router-link>
            </li>
            <li class="nav-item active">
              <router-link class="nav-link" to="#">My Profile</router-link>
            </li>
            <li v-if="auth" class="nav-item active">
              <router-link class="nav-link" to="/logout">Logout</router-link>
            </li>
            <li v-else class="nav-item">
              <router-link class="nav-link active" to="/login">Login</router-link>
            </li>
        </ul>
    </nav>
    `,
  data: function() {
    return {
      auth: localStorage.hasOwnProperty("token")
    }
  }
});

Vue.component('app-footer', {
  template: `
    <footer>
        <div class="container">
            
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
  template: `
    <div class="row landing-container">
        <div class="col-md-4 landing-container-child" style="margin-left: 11%;">
            <img id="home" src="/static/images/landing.jpg" id="landing-img"/>
        </div>
        <div class="col-md-4  landing-container-child float-clear">
          <div class="card" style="width: 28rem; height: 23rem; box-shadow: 2px 2px 10px grey;">
            <img class="card-img-top" src="static/images/photogramLogo.png" alt="Card image cap" style="width: 60%; margin: 0 auto; padding-top: 20px;">
            <div class="card-body" style="padding-top: 0px;">
              <hr>
              <p class="card-text">Share photos of your favourite moments with friends, family and the world.</p>
              <div style="margin-top: 20%;">
                  <router-link class="btn btn-success col-md-5" to="/register">Register</router-link>
                  <router-link class="btn btn-primary col-md-5" to="/login">Login</router-link>
              </div>
            </div>
          </div>  
        </div>
    </div>
   `,
  data: function() {
    return {}
  }
});


const Login = Vue.component('login', {
  template: `
      <div id="login_form">
        <form id="login-form" @submit.prevent="login">
            <div class="card-header center">
              <strong>Login</strong>
            </div>
            <div class="card center">
              <div class="card-body login">
                <div style="margin-top:5%;">
                  <label for='usrname'><strong>Username</strong></label><br>
                  <input type='text' id='usrname' name='username' style="width: 70%;"/>
                </div>
                <div style="margin-top:5%;">
                  <label for='passwd'><strong>Password</strong></label><br>
                  <input type='password' id='passwd' name='password' style="width: 70%;"/>
                </div>
                <div style="margin-top:5%;">
                  <button id="submit" class="btn btn-success">Login</button> 
                </div>
                <div v-if='messageFlag' style="margin-top:5%;">
                  <div class="alert alert-danger center" style="width: 100%; margin-top: 50%;">
                    {{ message }}
                  </div>
                </div>
              </div>
            </div>
        </form>
      </div>
    `,
  methods: {
    login: function() {
      const self = this

      fetch("api/auth/login", {
        method: "POST",
        body: new FormData(document.getElementById('login'))
      }).then(function(response) {
        return response.json()
      }).then(function(jsonResponse) {
        self.messageFlag = true;

        if (jsonResponse.hadOwnProperty(token)) {
          localStorage.token = jsonResponse.token
          router.go();
          router.push("/")
        }
        else {
          self.message = jsonResponse.error
        }

      }).catch(function(error) {
        self.messageFlag = false;
        console.log(error);
      });
    }
  },
  data: function() {
    return {
      messageFlag: false,
      message: ""
    }
  }
});

const Logout = Vue.component("logout", {
  created: function() {
    const self = this;

    fetch("api/auth/logout", {
      method: "POST"
    }).then(function(response) {
      return response.json();
    }).then(function(jsonResponse) {
      localStorage.removeItem("token");
      router.go();
      router.push("/");
    }).catch(function(error) {
      console.log(error);
    });
  }
});


const NewPost = Vue.component('new-post', {
  template: `
  <div>
    <div v-if='messageFlag' >
      <div v-if="errorFlag">
        <div class="center" style="width: 100%; margin-top: 5%;">
          <ul class="alert alert-danger">
            <li v-for="error in message">
                {{ error }}
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="alert alert-success center" style="width: 100%; margin-top: 5%;">
        {{ message }}
      </div>
    </div>
    
    <form class="center" id="npostform" @submit.prevent="submit">
      <div class="card-header center"><strong>New Post</strong></div>
      <div class="card center">
        <div class="card-body">
          	<label><strong>Photo</strong></label><br>
            <label class="btn" style="border: 0.5px solid black" for="photo"><strong>Browse</strong></label>
            <label>{{ filename }}</label>
            <br>
            <input type = "file" id="photo" style="display: none;" v-on:change="updateFilename"/>
            <label style="margin-top: 5%"><strong>Caption</strong></label><br>
            <textarea style="width:100%" placeholder="Write a caption..."></textarea>
            <button id="submit" class = "btn btn-success">Submit</button>
        </div>    
      </div>
    </form>
  </div>
  `,
  methods: {
    updateFilename: function() {
      const self = this
      let filenameArr = $("#photo")[0].value.split("\\");
      self.filename = filenameArr[filenameArr.length - 1]
    },
    submit: function() {
      self = this;

      fetch(`/api/users/${JSON.parse(localStorage.user).id}/posts`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.token}`
        },
        body: new FormData(document.getElementById("npostform"))

      }).then(function(response) {
        return response.json();
      }).then(function(jsonResponse) {
        window.self.messageFlag = true;

        if (jsonResponse.hasOwnProperty("message")) {
          window.self.message = jsonResponse.message
        }
        else {
          window.self.errorFlag = true;
          window.self.message = jsonResponse.errors;
        }
      }).catch(function(error) {
        console.log(error);
      });
    }
  },
  data: function() {
    return {
      filename: 'No File Selected',
      messageFlag: false,
      errorFlag: false,
      message: ""
    }
  }

});

const Register = Vue.component("register", {


  template: `
        <div>
        <div v-if='messageFlag' >
        
            <div v-if="!errorFlag ">
                <div class="alert alert-success" >
                    {{ message }}
                </div>
            </div>
            <div v-else >
                <ul class="alert alert-danger">
                    <li v-for="error in message">
                        {{ error }}
                    </li>
                </ul>
            </div>
            
        </div>
        
      <div>
          <h1 id="sup">Sign Up</h1>
          
          <div class=regbox>
        <form id="register" @submit.prevent="Register" enctype="multipart/form-data">
        <div>
            <label>Firstname:</label><br/>
            
          <input type='text' id='firstname' name='firstname' style="width: 100%;"/>
        </div>
        <div>
            <label>Lastname:</label><br/>
          <input type='text' id='lastname' name='lastname' style="width: 100%;"/>
        </div>
        <div>
            <label>Username:</label><br/>
          <input type='text' id='username' name='username' style="width: 100%;"/>
           
        </div>
        <div>
            <label>Password:</label><br/>
          <input type='password' id='password' name='password' style="width: 100%;"/>
        </div>
        <div>
            <label>Email:</label><br/>
          <input type='text' id='email' name='email' placeholder="jdoe@example.com" style="width: 100%;"/>
        </div>
        <div>
            <label>Location:</label><br/>
          <input type='text' id='location' name='location' style="width: 100%;"/>
        </div>
        <div >
            <label >Biography:</label><br/>
          <textarea id="textA" name="biography"> </textarea><br/>
        </div>
        <div>
         <label>Photo:</label><br/>
            <label for='photo' class='btn btn-primary'>Browse....</label> <span>{{ filename }}</span>
            
            <input id="photo" type="file" name='photo' style="display: none" v-on:change = "onFileSelected" /><br/>
            
        </div>
            
            <div>
                  <input type="submit" id="submit" class="btn btn-success" value="Register" /> 
                </div>
            
        </form>
        </div>
        </div>
    </div>
  `,
  methods: {
    Register: function() {
      let self = this;
      let register = document.getElementById('register');
      let form_data = new FormData(register);

      fetch("/api/users/register", {
        method: "POST",
        body: form_data,
        headers: {
          'X-CSRFToken': token
        },
        credentials: 'same-origin'
      }).then(function(response) {
        return response.json();
      }).then(function(jsonResponse) {
        // display a success message
        self.messageFlag = true

        if (jsonResponse.hasOwnProperty("errors")) {
          self.errorFlag = true;
          self.message = jsonResponse.errors;
        }
        else if (jsonResponse.hasOwnProperty("message")) {
          router.push("/login");
        }
      });
    },
    onFileSelected: function() {
      let self = this
      let filenameArr = $("#photo")[0].value.split("\\");
      self.filename = filenameArr[filenameArr.length - 1]
    }
  },
  data: function() {
    return {
      errorFlag: false,
      messageFlag: false,
      message: [],
      filename: "No File Selected"
    }
  }
});
/*
const Explore=Vue.component("explore",{
  
  template:``,
  methods:{
    fetch("/api/posts",{
      method: "GET"
      body:
      headers:{"Authorization":`Bearer ${localStorage.token}`
    })
  }
  
})*/


const Profile = Vue.component("profile", {
  template: `
  <div>
    <div class="card row" style="width:100%">
        <div class="card-body row profile-haeder" style="padding: 0;" >
          <img id="profile_image" class="col-md-2" v-bind:src=user.profile_image style="width: 100%; height: 15%" />
          <div id="profile_info" class="col-md-7" style="margin-top: 0px;padding-right: 0;">
            <strong><label>{{ user.firstname }}</label>
            <label>{{ user.lastname }}</label></strong>
            <div id="local" style="color: gray;">
              <label>{{ user.location }}</label><br>
              <label>{{ user.joined_on }}</label>
            </div>
            <p id="bio" style="color: gray;">
              {{ user.bio }}
            </p>
          </div>
          <div id="follows" class="col-sm-3" style="padding-left:  0; padding-right:  0;">
            <strong><label id="posts" class="col-md-5">{{ user.postCount }}</label>
            <label id="followers" class="col-md-5">{{ user.followers }}</label></strong> <br>
            <label class="col-md-5" style="color: gray; font-weight: 600; font-size: larger;">Posts</label>
            <label class="col-md-5" style="color: gray; font-weight: 600; font-size: larger;">Followers</label>
            <label id="follow-btn" class="btn btn-primary" v-on:click="follow" style="width:100%; margin-top: 17%;">Follow</label>
          </div>
        </div>
    </div>
    
    <div id="post-area" class="row" style="width:100%;">
      <div class="profile-post col-md-4" style="margin-top:3%;" v-for="post in user.posts">
          <img v-bind:src=post.photo style="width: 100%;" />
      </div>
    </div>
  </div>
  `,
  methods: {
    follow: function() {
      self = this;

      fetch(`/api/users/${self.user.id}/follow`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ "follower_id": window.self.current_user.id })
      }).then(function(response) {
        if (response.hasOwnProperty("message")) {
          $("#follow-btn")[0].innerHTML = "Following";
          $("#follow-btn").removeClass("btn-primary");
          $("#follow-btn").addClass("btn-success")
            ++window.self.user.followers;
        }
      }).catch(function(error) {
        console.log(error)
      });
    }
  },
  data: function() {
    return {
      user: {
        firstname: "John",
        lastname: "Doe",
        location: "test location",
        joined_on: "9/9/9999",
        bio: "i wonder who helel is? :p",
        postCount: 22,
        followers: 3,
        profile_image: "https://www.ienglishstatus.com/wp-content/uploads/2018/04/cute-profile-pics-for-whatsapp-images.png",
        posts: [{
            "id": 1,
            "user_id": 1,
            "description": "some-photo.jpg",
            "photo": "https://i.pinimg.com/originals/09/af/7b/09af7b57dd1e78178ed461af5d1b9d56.jpg",
            "created_on": "2018-04-03 14:30:00"
          },
          {
            "id": 1,
            "user_id": 1,
            "description": "some-photo.jpg",
            "photo": "https://images.pexels.com/photos/207962/pexels-photo-207962.jpeg?auto=compress&cs=tinysrgb&h=350",
            "created_on": "2018-04-03 14:30:00"
          },
          {
            "id": 1,
            "user_id": 1,
            "description": "some-photo.jpg",
            "photo": "https://www.google.com/photos/about/static/images/charlie-1.png",
            "created_on": "2018-04-03 14:30:00"
          },
          {
            "id": 1,
            "user_id": 1,
            "photo": "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&h=350",
            "description": "My Cool photo",
            "created_on": "2018-04-03 14:30:00"
          },
          {
            "id": 1,
            "user_id": 1,
            "photo": "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&h=350",
            "description": "My Cool photo",
            "created_on": "2018-04-03 14:30:00"
          }
        ]
      }
    }
  }
});


const router = new VueRouter({
  routes: [
    { path: "/", component: Home },
    { path: "/register", component: Register },
    { path: "/login", component: Login },
    { path: "/explore", component: Profile },
    { path: "/logout", component: Logout }
  ]
});

// Instantiate our main Vue Instance

let app = new Vue({
  el: '#app',
  data: {
    welcome: 'Explore. Meet. Live'
  },
  router
});