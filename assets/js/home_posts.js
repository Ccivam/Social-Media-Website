const { post } = require("../../routes/post");

{
    //Method to submit the form data for new post using AJAX
    let createPost=function(){
        let newPostForm=$('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            
            $.ajax({
                type:'post',
                url:'/post/create',
                data:newPostForm.serialize(),//This will convert the form into JSON format
                success:function(data){
                      let newPost=newPostDom(data.data.post,data.data.name);
                      $('#posts-list-container>ul').prepend(newPost);
                      deletePost($(' .delete-post-button',newPost));
                      new ToggleLike($('.toggle-like-button',newPost));
                },error:function(error){
                    console.log(error.responseText);
                }
            });

        });

    }
    //method to create a post in DOM
    let newPostDom=function(post,name){
        return $(`<li id="post-${post._id}">
        <p>
           
            <small>
                <a class="delete-post-button" href="/post/destroy/${post._id}">DELETE</a><br>
            </small>  
           
       ${post.content}<br>
       <small>${name}</small>
       <br>
       <small>
            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
               0 Likes
            </a>
       </small>
        </p>
        <div class="post-comments">
           
                 <form action="/comments/create" method="post">
                    <input type="text" name="content" placeholder="Type here to add comments..." required>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add Comment">
                 </form>
            
            
            <div class="post-comments-list">
                <ul id="post-comments-${post._id}">
                    
                   
                </ul>

            </div>
        </div>
     </li>`)
    }
    
    //Method to delete a post from DOM
    let deletePost=function(deleteLink){
        $(deleteLink).click(function(e){
               e.preventDefault();
               $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){
                        $(`#post-${data.post_id}`).remove();
                        
               },error:function(error){

                      console.log(error.responseText);
               }
               });
        })
    
    }
let createComment=function(){
    let newCommentForm=$('#new-comment-form');
    newCommentForm.submit(function(e){
        e.preventDefault();
        $.ajax({
             type:'post',
             url:'/comments/create',
             data:newCommentForm.serialize(),
             success:function(data){
                   let newcomment=newcommentDom(data.comments);
                   $('.post-comments-list').append(newcomment);
                   deleteComment('#Delete-comment',newcomment);
                   new ToggleLike($('.toggle-like-button',newComment));
             },error:function(error){
                console.log(error.responseText);
             }

        });

    })
}
   let newcommentDom=function(comments){
             return (` 
             <ul id="post-comments-${comments.post}">
             <li comment-${comments._id}>
             <p>
                 
                     <small>
                      <a id="Delete-comment" href="/comments/destroy/${comments._id}">DELETE</a>
                     </small>
                 <%}%>   
              ${comments.content}
 
              <br>
              <small>
              ${comments.user.name}
              </small>
              <small>
                 <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comments._id}&type=Comment">
                   0 Likes
                 </a>
              </small>
             </p>
             </li>
             </ul>`)
   }
   let deleteComment=function(commentLink){
    $(commentLink).click(function(e){
             e.preventDefault();
             $.ajax({
                type:'get',
                url:$(commentLink).prop('href'),
                success:function(data){
                    $(`comment-${data.comment_id}`).remove();
                    
                   },error:function(error){

                  console.log(error.responseText);
           }
             })
    });
   }
createPost();
}