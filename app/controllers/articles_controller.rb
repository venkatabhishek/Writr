class ArticlesController < ApplicationController

    before_action :authenticate_user!, only: [:new]

    def new
    end

    def create
        puts params[:content].class

    end

end
