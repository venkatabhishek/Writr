class ArticlesController < ApplicationController
    skip_before_action :verify_authenticity_token

    def new
    end

    def create
        puts params[:content].class
    end

    def updateHelper
    end

end
