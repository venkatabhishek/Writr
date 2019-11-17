class Article < ApplicationRecord
  belongs_to :user
  has_many :comments, as: :commentable, dependent: :destroy

  before_create :set_defaults

  def set_defaults
    self.draft = true
    self.title = "Default Title"
  end

end
