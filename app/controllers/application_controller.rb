# frozen_string_literal: true

class ApplicationController < ActionController::Base
  skip_before_action :verify_authenticity_token

  protected

  def after_sign_in_path_for(_resource)
    '/'
 end
end
