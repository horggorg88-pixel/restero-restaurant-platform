<?php

namespace App\Containers\AppSection\Table\Tasks;

use App\Containers\AppSection\Table\Data\Repositories\TableRepository;
use App\Containers\AppSection\Table\Events\TableFoundByIdEvent;
use App\Containers\AppSection\Table\Models\Table;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Parents\Tasks\Task as ParentTask;

class FindTableByIdTask extends ParentTask
{
    public function __construct(
        protected readonly TableRepository $repository,
    ) {
    }

    /**
     * @throws NotFoundException
     */
    public function run($id): Table
    {
        try {
            $table = $this->repository->find($id);
            TableFoundByIdEvent::dispatch($table);

            return $table;
        } catch (\Exception) {
            throw new NotFoundException();
        }
    }
}
