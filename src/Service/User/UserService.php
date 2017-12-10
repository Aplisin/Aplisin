<?php

namespace App\Service\User;

use App\Service\BaseService;
use Doctrine\Common\Collections\Criteria;

class UserService extends BaseService
{
    public function getUserByLoginField($keyword)
    {
        return $this->getUserRepository()->findOneBy(array('username' => $keyword));
    }

    public function getQueryBuilder(array $conditions, array $orderBys, $alias, $indexBy = null)
    {
        return $this->getUserRepository()->getQueryBuilder($conditions, $orderBys, $alias, $indexBy);
    }

    protected function getUserRepository()
    {
        return $this->getEntityManager()->getRepository('App:User\User');
    }
}