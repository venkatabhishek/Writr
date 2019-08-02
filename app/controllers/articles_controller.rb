class ArticlesController < ApplicationController

    def new
    end

    def create
        puts params[:content].class
    end

    def updateHelper
    end

end
