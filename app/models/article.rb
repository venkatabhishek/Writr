class Article < ApplicationRecord
  belongs_to :user

  before_create :set_defaults

  def set_defaults
    self.draft = false
    self.title = "Default Title"
  end

end
