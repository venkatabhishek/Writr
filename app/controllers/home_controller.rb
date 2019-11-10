class HomeController < ApplicationController

  def index
    @articles = Article.where("draft = ?", false).to_a
    @intro = @articles.shift
  end
end
