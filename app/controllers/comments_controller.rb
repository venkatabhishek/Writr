class CommentsController < ApplicationController
    before_action :find_commentable, only: :create
    
    
        def create
          params = comment_params
          params = params.merge(user_id: current_user.id)
          @commentable.comments.build(params)
          @commentable.save
          redirect_back(fallback_location: root_path)
        end

        def destroy
          comment = Comment.find(params[:id])
          comment.destroy

          render json: { status: 1 }
        end
    
        private
    
        def comment_params
          params.require(:comment).permit(:content)
        end
    
        def find_commentable
          if params[:comment_id]
            @commentable = Comment.find_by_id(params[:comment_id]) 
          elsif params[:article_id]
            @commentable = Article.find_by_id(params[:article_id])
          end
        end
    
    end
    