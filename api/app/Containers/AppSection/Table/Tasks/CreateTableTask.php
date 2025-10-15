<?php

namespace App\Containers\AppSection\Table\Tasks;

use App\Containers\AppSection\Table\Data\Repositories\TableRepository;
use App\Containers\AppSection\Table\Events\TableCreatedEvent;
use App\Containers\AppSection\Table\Models\Table;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Tasks\Task as ParentTask;

class CreateTableTask extends ParentTask
{
    public function __construct(
        protected readonly TableRepository $repository,
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     */
    public function run(array $data): Table
    {
        try {
            $table = $this->repository->create($data);
            TableCreatedEvent::dispatch($table);

            return $table;
        } catch (\Exception) {
            throw new CreateResourceFailedException();
        }
    }
}
