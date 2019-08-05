require 'json'

class ArticlesController < ApplicationController

    before_action :authenticate_user!, only: [:new]

    def new
        @signed_in = user_signed_in?
    end

    def create


        article = current_user.articles.create(article_params)
        article.save

        render :json => {id: article.id }
    end

    private
    def article_params
        params.require(:article).permit(:content)
    end

end
