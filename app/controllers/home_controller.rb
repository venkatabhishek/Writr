require 'fuzzy_match'

class HomeController < ApplicationController

  def index
    @articles = Article.where("draft = ?", false).to_a
    @intro = @articles.shift
  end

  def search
    if params[:q]
      fz = FuzzyMatch.new(Article.all, :read => :title)
      @articles = fz.find_all(params[:q])
    else
      @articles = Article.all
    end
  end


end
